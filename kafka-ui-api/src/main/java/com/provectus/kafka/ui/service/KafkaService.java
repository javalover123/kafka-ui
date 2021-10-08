package com.provectus.kafka.ui.service;

import com.provectus.kafka.ui.exception.InvalidRequestApiException;
import com.provectus.kafka.ui.exception.LogDirNotFoundApiException;
import com.provectus.kafka.ui.exception.TopicMetadataException;
import com.provectus.kafka.ui.exception.TopicOrPartitionNotFoundException;
import com.provectus.kafka.ui.exception.ValidationException;
import com.provectus.kafka.ui.model.BrokerLogdirUpdateDTO;
import com.provectus.kafka.ui.model.CleanupPolicy;
import com.provectus.kafka.ui.model.CreateTopicMessageDTO;
import com.provectus.kafka.ui.model.InternalBrokerDiskUsage;
import com.provectus.kafka.ui.model.InternalBrokerMetrics;
import com.provectus.kafka.ui.model.InternalClusterMetrics;
import com.provectus.kafka.ui.model.InternalConsumerGroup;
import com.provectus.kafka.ui.model.InternalPartition;
import com.provectus.kafka.ui.model.InternalReplica;
import com.provectus.kafka.ui.model.InternalSegmentSizeDto;
import com.provectus.kafka.ui.model.InternalTopic;
import com.provectus.kafka.ui.model.InternalTopicConfig;
import com.provectus.kafka.ui.model.KafkaCluster;
import com.provectus.kafka.ui.model.MetricDTO;
import com.provectus.kafka.ui.model.PartitionsIncreaseDTO;
import com.provectus.kafka.ui.model.ReplicationFactorChangeDTO;
import com.provectus.kafka.ui.model.ServerStatusDTO;
import com.provectus.kafka.ui.model.TopicCreationDTO;
import com.provectus.kafka.ui.model.TopicUpdateDTO;
import com.provectus.kafka.ui.serde.DeserializationService;
import com.provectus.kafka.ui.serde.RecordSerDe;
import com.provectus.kafka.ui.util.ClusterUtil;
import com.provectus.kafka.ui.util.JmxClusterUtil;
import com.provectus.kafka.ui.util.JmxMetricsName;
import com.provectus.kafka.ui.util.JmxMetricsValueName;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.LongSummaryStatistics;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.admin.NewPartitionReassignment;
import org.apache.kafka.clients.admin.NewPartitions;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.Node;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.TopicPartitionReplica;
import org.apache.kafka.common.errors.InvalidRequestException;
import org.apache.kafka.common.errors.LogDirNotFoundException;
import org.apache.kafka.common.errors.TimeoutException;
import org.apache.kafka.common.errors.UnknownTopicOrPartitionException;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.apache.kafka.common.header.internals.RecordHeaders;
import org.apache.kafka.common.requests.DescribeLogDirsResponse;
import org.apache.kafka.common.serialization.ByteArraySerializer;
import org.apache.kafka.common.serialization.BytesDeserializer;
import org.apache.kafka.common.utils.Bytes;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuple3;
import reactor.util.function.Tuples;

@Service
@RequiredArgsConstructor
@Log4j2
public class KafkaService {

  private final ZookeeperService zookeeperService;
  private final JmxClusterUtil jmxClusterUtil;
  private final ClustersStorage clustersStorage;
  private final DeserializationService deserializationService;
  private final AdminClientService adminClientService;
  private final FeatureService featureService;


  public KafkaCluster getUpdatedCluster(KafkaCluster cluster, InternalTopic updatedTopic) {
    final Map<String, InternalTopic> topics =
        Optional.ofNullable(cluster.getTopics()).map(
            t -> new HashMap<>(cluster.getTopics())
        ).orElse(new HashMap<>());
    topics.put(updatedTopic.getName(), updatedTopic);
    return cluster.toBuilder().topics(topics).build();
  }

  public KafkaCluster getUpdatedCluster(KafkaCluster cluster, String topicToDelete) {
    final Map<String, InternalTopic> topics = new HashMap<>(cluster.getTopics());
    topics.remove(topicToDelete);
    return cluster.toBuilder().topics(topics).build();
  }

  @SneakyThrows
  public Mono<KafkaCluster> getUpdatedCluster(KafkaCluster cluster) {
    return adminClientService.get(cluster)
        .flatMap(
            ac -> ac.getClusterVersion().flatMap(
                version ->
                    getClusterMetrics(ac)
                        .flatMap(i -> fillJmxMetrics(i, cluster.getName(), ac))
                        .flatMap(clusterMetrics ->
                            getTopicsData(ac).flatMap(it -> {
                                  if (cluster.getDisableLogDirsCollection() == null
                                      || !cluster.getDisableLogDirsCollection()) {
                                    return updateSegmentMetrics(ac, clusterMetrics, it
                                    );
                                  } else {
                                    return emptySegmentMetrics(clusterMetrics, it);
                                  }
                                }
                            ).map(segmentSizeDto -> buildFromData(cluster, version, segmentSizeDto))
                        )
            )
        ).flatMap(
            nc ->  featureService.getAvailableFeatures(cluster).collectList()
                .map(f -> nc.toBuilder().features(f).build())
        ).doOnError(e ->
            log.error("Failed to collect cluster {} info", cluster.getName(), e)
        ).onErrorResume(
            e -> Mono.just(cluster.toBuilder()
                .status(ServerStatusDTO.OFFLINE)
                .lastKafkaException(e)
                .build())
        );
  }

  private KafkaCluster buildFromData(KafkaCluster currentCluster,
                                     String version,
                                     InternalSegmentSizeDto segmentSizeDto) {

    var topics = segmentSizeDto.getInternalTopicWithSegmentSize();
    var brokersMetrics = segmentSizeDto.getClusterMetricsWithSegmentSize();
    var brokersIds = new ArrayList<>(brokersMetrics.getInternalBrokerMetrics().keySet());

    InternalClusterMetrics.InternalClusterMetricsBuilder metricsBuilder =
        brokersMetrics.toBuilder();

    InternalClusterMetrics topicsMetrics = collectTopicsMetrics(topics);

    ServerStatusDTO zookeeperStatus = ServerStatusDTO.OFFLINE;
    Throwable zookeeperException = null;
    try {
      zookeeperStatus = zookeeperService.isZookeeperOnline(currentCluster)
          ? ServerStatusDTO.ONLINE
          : ServerStatusDTO.OFFLINE;
    } catch (Throwable e) {
      zookeeperException = e;
    }

    InternalClusterMetrics clusterMetrics = metricsBuilder
        .activeControllers(brokersMetrics.getActiveControllers())
        .topicCount(topicsMetrics.getTopicCount())
        .brokerCount(brokersMetrics.getBrokerCount())
        .underReplicatedPartitionCount(topicsMetrics.getUnderReplicatedPartitionCount())
        .inSyncReplicasCount(topicsMetrics.getInSyncReplicasCount())
        .outOfSyncReplicasCount(topicsMetrics.getOutOfSyncReplicasCount())
        .onlinePartitionCount(topicsMetrics.getOnlinePartitionCount())
        .offlinePartitionCount(topicsMetrics.getOfflinePartitionCount())
        .zooKeeperStatus(ClusterUtil.convertToIntServerStatus(zookeeperStatus))
        .version(version)
        .build();

    return currentCluster.toBuilder()
        .version(version)
        .status(ServerStatusDTO.ONLINE)
        .zookeeperStatus(zookeeperStatus)
        .lastZookeeperException(zookeeperException)
        .lastKafkaException(null)
        .metrics(clusterMetrics)
        .topics(topics)
        .brokers(brokersIds)
        .build();
  }

  private InternalClusterMetrics collectTopicsMetrics(Map<String, InternalTopic> topics) {

    int underReplicatedPartitions = 0;
    int inSyncReplicasCount = 0;
    int outOfSyncReplicasCount = 0;
    int onlinePartitionCount = 0;
    int offlinePartitionCount = 0;

    for (InternalTopic topic : topics.values()) {
      underReplicatedPartitions += topic.getUnderReplicatedPartitions();
      inSyncReplicasCount += topic.getInSyncReplicas();
      outOfSyncReplicasCount += (topic.getReplicas() - topic.getInSyncReplicas());
      onlinePartitionCount +=
          topic.getPartitions().values().stream().mapToInt(s -> s.getLeader() == null ? 0 : 1)
              .sum();
      offlinePartitionCount +=
          topic.getPartitions().values().stream().mapToInt(s -> s.getLeader() != null ? 0 : 1)
              .sum();
    }

    return InternalClusterMetrics.builder()
        .underReplicatedPartitionCount(underReplicatedPartitions)
        .inSyncReplicasCount(inSyncReplicasCount)
        .outOfSyncReplicasCount(outOfSyncReplicasCount)
        .onlinePartitionCount(onlinePartitionCount)
        .offlinePartitionCount(offlinePartitionCount)
        .topicCount(topics.size())
        .build();
  }

  private Map<String, InternalTopic> mergeWithConfigs(
      List<InternalTopic> topics, Map<String, List<InternalTopicConfig>> configs) {
    return topics.stream()
        .map(t -> t.toBuilder().topicConfigs(configs.get(t.getName())).build())
        .map(t -> t.toBuilder().cleanUpPolicy(
            CleanupPolicy.fromString(t.getTopicConfigs().stream()
                .filter(config -> config.getName().equals("cleanup.policy"))
                .findFirst()
                .orElseGet(() -> InternalTopicConfig.builder().value("unknown").build())
                .getValue())).build())
        .collect(Collectors.toMap(
            InternalTopic::getName,
            e -> e
        ));
  }

  @SneakyThrows
  private Mono<List<InternalTopic>> getTopicsData(ReactiveAdminClient client) {
    return client.listTopics(true)
        .flatMap(topics -> getTopicsData(client, topics).collectList());
  }

  private Flux<InternalTopic> getTopicsData(ReactiveAdminClient client, Collection<String> topics) {
    final Mono<Map<String, List<InternalTopicConfig>>> configsMono =
        loadTopicsConfig(client, topics);

    return client.describeTopics(topics)
        .map(m -> m.values().stream()
            .map(ClusterUtil::mapToInternalTopic).collect(Collectors.toList()))
        .flatMap(internalTopics -> configsMono
            .map(configs -> mergeWithConfigs(internalTopics, configs).values()))
        .flatMapMany(Flux::fromIterable);
  }


  private Mono<InternalClusterMetrics> getClusterMetrics(ReactiveAdminClient client) {
    return client.describeCluster().map(desc ->
        InternalClusterMetrics.builder()
            .brokerCount(desc.getNodes().size())
            .activeControllers(desc.getController() != null ? 1 : 0)
            .build()
    );
  }

  @SneakyThrows
  public Mono<InternalTopic> createTopic(ReactiveAdminClient adminClient,
                                         Mono<TopicCreationDTO> topicCreation) {
    return topicCreation.flatMap(topicData ->
            adminClient.createTopic(
                topicData.getName(),
                topicData.getPartitions(),
                topicData.getReplicationFactor().shortValue(),
                topicData.getConfigs()
            ).thenReturn(topicData)
        )
        .onErrorResume(t -> Mono.error(new TopicMetadataException(t.getMessage())))
        .flatMap(topicData -> getUpdatedTopic(adminClient, topicData.getName()))
        .switchIfEmpty(Mono.error(new RuntimeException("Can't find created topic")));
  }

  public Mono<InternalTopic> createTopic(
      KafkaCluster cluster, Mono<TopicCreationDTO> topicCreation) {
    return adminClientService.get(cluster).flatMap(ac -> createTopic(ac, topicCreation));
  }

  public Mono<Void> deleteTopic(KafkaCluster cluster, String topicName) {
    return adminClientService.get(cluster).flatMap(c -> c.deleteTopic(topicName));
  }

  @SneakyThrows
  private Mono<Map<String, List<InternalTopicConfig>>> loadTopicsConfig(
      ReactiveAdminClient client, Collection<String> topicNames) {
    return client.getTopicsConfig(topicNames)
        .map(configs ->
            configs.entrySet().stream().collect(Collectors.toMap(
                Map.Entry::getKey,
                c -> c.getValue().stream()
                    .map(ClusterUtil::mapToInternalTopicConfig)
                    .collect(Collectors.toList()))));
  }

  public Mono<List<InternalConsumerGroup>> getConsumerGroupsInternal(KafkaCluster cluster) {
    return adminClientService.get(cluster).flatMap(ac ->
        ac.listConsumerGroups()
            .flatMap(groupIds -> getConsumerGroupsInternal(cluster, groupIds)));
  }

  public Mono<List<InternalConsumerGroup>> getConsumerGroupsInternal(KafkaCluster cluster,
                                                                     List<String> groupIds) {
    return adminClientService.get(cluster).flatMap(ac ->
        ac.describeConsumerGroups(groupIds)
            .map(Map::values)
            .flatMap(descriptions ->
                Flux.fromIterable(descriptions)
                    .parallel()
                    .flatMap(d ->
                        ac.listConsumerGroupOffsets(d.groupId())
                            .map(offsets -> ClusterUtil.convertToInternalConsumerGroup(d, offsets))
                    )
                    .sequential()
                    .collectList()));
  }

  public Mono<List<InternalConsumerGroup>> getConsumerGroups(
      KafkaCluster cluster, Optional<String> topic, List<String> groupIds) {
    final Mono<List<InternalConsumerGroup>> consumerGroups;

    if (groupIds.isEmpty()) {
      consumerGroups = getConsumerGroupsInternal(cluster);
    } else {
      consumerGroups = getConsumerGroupsInternal(cluster, groupIds);
    }

    return consumerGroups.map(c ->
        c.stream()
            .map(d -> ClusterUtil.filterConsumerGroupTopic(d, topic))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(g ->
                g.toBuilder().endOffsets(
                    topicPartitionsEndOffsets(cluster, g.getOffsets().keySet())
                ).build()
            )
            .collect(Collectors.toList())
    );
  }

  public Map<TopicPartition, Long> topicPartitionsEndOffsets(
      KafkaCluster cluster, Collection<TopicPartition> topicPartitions) {
    try (KafkaConsumer<Bytes, Bytes> consumer = createConsumer(cluster)) {
      return consumer.endOffsets(topicPartitions);
    }
  }

  public KafkaConsumer<Bytes, Bytes> createConsumer(KafkaCluster cluster) {
    return createConsumer(cluster, Map.of());
  }

  public KafkaConsumer<Bytes, Bytes> createConsumer(KafkaCluster cluster,
                                                    Map<String, Object> properties) {
    Properties props = new Properties();
    props.putAll(cluster.getProperties());
    props.put(ConsumerConfig.CLIENT_ID_CONFIG, "kafka-ui-" + UUID.randomUUID());
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, cluster.getBootstrapServers());
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, BytesDeserializer.class);
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, BytesDeserializer.class);
    props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
    props.putAll(properties);

    return new KafkaConsumer<>(props);
  }

  @SneakyThrows
  public Mono<InternalTopic> updateTopic(KafkaCluster cluster,
                                         String topicName,
                                         TopicUpdateDTO topicUpdate) {
    return adminClientService.get(cluster)
        .flatMap(ac ->
            ac.updateTopicConfig(topicName,
                topicUpdate.getConfigs()).then(getUpdatedTopic(ac, topicName)));
  }

  private Mono<InternalTopic> getUpdatedTopic(ReactiveAdminClient ac, String topicName) {
    return getTopicsData(ac, List.of(topicName)).next();
  }

  private InternalTopic mergeWithStats(InternalTopic topic,
                                       Map<String, LongSummaryStatistics> topics,
                                       Map<TopicPartition, LongSummaryStatistics> partitions) {
    final LongSummaryStatistics stats = topics.get(topic.getName());

    return topic.toBuilder()
        .segmentSize(stats.getSum())
        .segmentCount(stats.getCount())
        .partitions(
            topic.getPartitions().entrySet().stream().map(e ->
                Tuples.of(e.getKey(), mergeWithStats(topic.getName(), e.getValue(), partitions))
            ).collect(Collectors.toMap(
                Tuple2::getT1,
                Tuple2::getT2
            ))
        ).build();
  }

  private InternalPartition mergeWithStats(String topic, InternalPartition partition,
                                           Map<TopicPartition, LongSummaryStatistics> partitions) {
    final LongSummaryStatistics stats =
        partitions.get(new TopicPartition(topic, partition.getPartition()));
    return partition.toBuilder()
        .segmentSize(stats.getSum())
        .segmentCount(stats.getCount())
        .build();
  }

  private Mono<InternalSegmentSizeDto> emptySegmentMetrics(InternalClusterMetrics clusterMetrics,
                                                            List<InternalTopic> internalTopics) {
    return Mono.just(
        InternalSegmentSizeDto.builder()
        .clusterMetricsWithSegmentSize(
            clusterMetrics.toBuilder()
                .segmentSize(0)
                .segmentCount(0)
                .internalBrokerDiskUsage(Collections.emptyMap())
                .build()
        )
        .internalTopicWithSegmentSize(
            internalTopics.stream().collect(
                Collectors.toMap(
                    InternalTopic::getName,
                    i -> i
                )
            )
        ).build()
    );
  }

  private Mono<InternalSegmentSizeDto> updateSegmentMetrics(ReactiveAdminClient ac,
                                                            InternalClusterMetrics clusterMetrics,
                                                            List<InternalTopic> internalTopics) {
    return ac.describeCluster().flatMap(
        clusterDescription ->
                ac.describeLogDirs().map(log -> {
                  final List<Tuple3<Integer, TopicPartition, Long>> topicPartitions =
                      log.entrySet().stream().flatMap(b ->
                          b.getValue().entrySet().stream().flatMap(topicMap ->
                              topicMap.getValue().replicaInfos.entrySet().stream()
                                  .map(e -> Tuples.of(b.getKey(), e.getKey(), e.getValue().size))
                          )
                      ).collect(Collectors.toList());

                  final Map<TopicPartition, LongSummaryStatistics> partitionStats =
                      topicPartitions.stream().collect(
                          Collectors.groupingBy(
                              Tuple2::getT2,
                              Collectors.summarizingLong(Tuple3::getT3)
                          )
                      );

                  final Map<String, LongSummaryStatistics> topicStats =
                      topicPartitions.stream().collect(
                          Collectors.groupingBy(
                              t -> t.getT2().topic(),
                              Collectors.summarizingLong(Tuple3::getT3)
                          )
                      );

                  final Map<Integer, LongSummaryStatistics> brokerStats =
                      topicPartitions.stream().collect(
                          Collectors.groupingBy(
                              Tuple2::getT1,
                              Collectors.summarizingLong(Tuple3::getT3)
                          )
                      );


                  final LongSummaryStatistics summary =
                      topicPartitions.stream().collect(Collectors.summarizingLong(Tuple3::getT3));


                  final Map<String, InternalTopic> resultTopics = internalTopics.stream().map(e ->
                      Tuples.of(e.getName(), mergeWithStats(e, topicStats, partitionStats))
                  ).collect(Collectors.toMap(
                      Tuple2::getT1,
                      Tuple2::getT2
                  ));

                  final Map<Integer, InternalBrokerDiskUsage> resultBrokers =
                      brokerStats.entrySet().stream().map(e ->
                          Tuples.of(e.getKey(), InternalBrokerDiskUsage.builder()
                              .segmentSize(e.getValue().getSum())
                              .segmentCount(e.getValue().getCount())
                              .build()
                          )
                      ).collect(Collectors.toMap(
                          Tuple2::getT1,
                          Tuple2::getT2
                      ));

                  return InternalSegmentSizeDto.builder()
                      .clusterMetricsWithSegmentSize(
                          clusterMetrics.toBuilder()
                              .segmentSize(summary.getSum())
                              .segmentCount(summary.getCount())
                              .internalBrokerDiskUsage(resultBrokers)
                              .build()
                      )
                      .internalTopicWithSegmentSize(resultTopics).build();
                })
    );
  }

  public List<MetricDTO> getJmxMetric(String clusterName, Node node) {
    return clustersStorage.getClusterByName(clusterName)
        .filter(c -> c.getJmxPort() != null)
        .filter(c -> c.getJmxPort() > 0)
        .map(c -> jmxClusterUtil.getJmxMetrics(node.host(), c.getJmxPort(), c.isJmxSsl(),
                c.getJmxUsername(), c.getJmxPassword()))
        .orElse(Collections.emptyList());
  }

  private Mono<InternalClusterMetrics> fillJmxMetrics(InternalClusterMetrics internalClusterMetrics,
                                                      String clusterName, ReactiveAdminClient ac) {
    return fillBrokerMetrics(internalClusterMetrics, clusterName, ac)
        .map(this::calculateClusterMetrics);
  }

  private Mono<InternalClusterMetrics> fillBrokerMetrics(
      InternalClusterMetrics internalClusterMetrics, String clusterName, ReactiveAdminClient ac) {
    return ac.describeCluster()
        .flatMapIterable(desc -> desc.getNodes())
        .map(broker ->
            Map.of(broker.id(), InternalBrokerMetrics.builder()
                .metrics(getJmxMetric(clusterName, broker)).build())
        )
        .collectList()
        .map(s -> internalClusterMetrics.toBuilder()
            .internalBrokerMetrics(ClusterUtil.toSingleMap(s.stream())).build());
  }

  private InternalClusterMetrics calculateClusterMetrics(
      InternalClusterMetrics internalClusterMetrics) {
    final List<MetricDTO> metrics = internalClusterMetrics.getInternalBrokerMetrics().values()
        .stream()
        .flatMap(b -> b.getMetrics().stream())
        .collect(
            Collectors.groupingBy(
                MetricDTO::getCanonicalName,
                Collectors.reducing(jmxClusterUtil::reduceJmxMetrics)
            )
        ).values().stream()
        .filter(Optional::isPresent)
        .map(Optional::get)
        .collect(Collectors.toList());
    final InternalClusterMetrics.InternalClusterMetricsBuilder metricsBuilder =
        internalClusterMetrics.toBuilder().metrics(metrics);
    metricsBuilder.bytesInPerSec(findTopicMetrics(
        metrics, JmxMetricsName.BytesInPerSec, JmxMetricsValueName.FiveMinuteRate
    ));
    metricsBuilder.bytesOutPerSec(findTopicMetrics(
        metrics, JmxMetricsName.BytesOutPerSec, JmxMetricsValueName.FiveMinuteRate
    ));
    return metricsBuilder.build();
  }

  private Map<String, BigDecimal> findTopicMetrics(List<MetricDTO> metrics,
                                                   JmxMetricsName metricsName,
                                                   JmxMetricsValueName valueName) {
    return metrics.stream().filter(m -> metricsName.name().equals(m.getName()))
        .filter(m -> m.getParams().containsKey("topic"))
        .filter(m -> m.getValue().containsKey(valueName.name()))
        .map(m -> Tuples.of(
            m.getParams().get("topic"),
            m.getValue().get(valueName.name())
        )).collect(Collectors.groupingBy(
            Tuple2::getT1,
            Collectors.reducing(BigDecimal.ZERO, Tuple2::getT2, BigDecimal::add)
        ));
  }

  public Map<Integer, InternalPartition> getTopicPartitions(KafkaCluster c, InternalTopic topic) {
    var tps = topic.getPartitions().values().stream()
        .map(t -> new TopicPartition(topic.getName(), t.getPartition()))
        .collect(Collectors.toList());
    Map<Integer, InternalPartition> partitions =
        topic.getPartitions().values().stream().collect(Collectors.toMap(
            InternalPartition::getPartition,
            tp -> tp
        ));

    try (var consumer = createConsumer(c)) {
      final Map<TopicPartition, Long> earliest = consumer.beginningOffsets(tps);
      final Map<TopicPartition, Long> latest = consumer.endOffsets(tps);

      return tps.stream()
          .map(tp -> partitions.get(tp.partition()).toBuilder()
              .offsetMin(Optional.ofNullable(earliest.get(tp)).orElse(0L))
              .offsetMax(Optional.ofNullable(latest.get(tp)).orElse(0L))
              .build()
          ).collect(Collectors.toMap(
              InternalPartition::getPartition,
              tp -> tp
          ));
    } catch (Exception e) {
      return Collections.emptyMap();
    }
  }

  public Mono<Void> deleteTopicMessages(KafkaCluster cluster, Map<TopicPartition, Long> offsets) {
    return adminClientService.get(cluster).flatMap(ac -> ac.deleteRecords(offsets));
  }

  public Mono<RecordMetadata> sendMessage(KafkaCluster cluster, String topic,
                                          CreateTopicMessageDTO msg) {
    RecordSerDe serde =
        deserializationService.getRecordDeserializerForCluster(cluster);

    Properties properties = new Properties();
    properties.putAll(cluster.getProperties());
    properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, cluster.getBootstrapServers());
    properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, ByteArraySerializer.class);
    properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, ByteArraySerializer.class);
    try (KafkaProducer<byte[], byte[]> producer = new KafkaProducer<>(properties)) {
      ProducerRecord<byte[], byte[]> producerRecord = serde.serialize(
          topic,
          msg.getKey(),
          msg.getContent(),
          msg.getPartition()
      );
      producerRecord = new ProducerRecord<>(
          producerRecord.topic(),
          producerRecord.partition(),
          producerRecord.key(),
          producerRecord.value(),
          createHeaders(msg.getHeaders()));

      CompletableFuture<RecordMetadata> cf = new CompletableFuture<>();
      producer.send(producerRecord, (metadata, exception) -> {
        if (exception != null) {
          cf.completeExceptionally(exception);
        } else {
          cf.complete(metadata);
        }
      });
      return Mono.fromFuture(cf);
    }
  }

  private Iterable<Header> createHeaders(Map<String, String> clientHeaders) {
    if (clientHeaders == null) {
      return null;
    }
    RecordHeaders headers = new RecordHeaders();
    clientHeaders.forEach((k, v) -> headers.add(new RecordHeader(k, v.getBytes())));
    return headers;
  }

  public Mono<InternalTopic> increaseTopicPartitions(
      KafkaCluster cluster,
      String topicName,
      PartitionsIncreaseDTO partitionsIncrease) {
    return adminClientService.get(cluster)
        .flatMap(ac -> {
          Integer actualCount = cluster.getTopics().get(topicName).getPartitionCount();
          Integer requestedCount = partitionsIncrease.getTotalPartitionsCount();

          if (requestedCount < actualCount) {
            return Mono.error(
                new ValidationException(String.format(
                    "Topic currently has %s partitions, which is higher than the requested %s.",
                    actualCount, requestedCount)));
          }
          if (requestedCount.equals(actualCount)) {
            return Mono.error(
                new ValidationException(
                    String.format("Topic already has %s partitions.", actualCount)));
          }

          Map<String, NewPartitions> newPartitionsMap = Collections.singletonMap(
              topicName,
              NewPartitions.increaseTo(partitionsIncrease.getTotalPartitionsCount())
          );
          return ac.createPartitions(newPartitionsMap)
              .then(getUpdatedTopic(ac, topicName));
        });
  }

  private Mono<InternalTopic> changeReplicationFactor(
      ReactiveAdminClient adminClient,
      String topicName,
      Map<TopicPartition, Optional<NewPartitionReassignment>> reassignments
  ) {
    return adminClient.alterPartitionReassignments(reassignments)
        .then(getUpdatedTopic(adminClient, topicName));
  }

  /**
   * Change topic replication factor, works on brokers versions 5.4.x and higher
   */
  public Mono<InternalTopic> changeReplicationFactor(
      KafkaCluster cluster,
      String topicName,
      ReplicationFactorChangeDTO replicationFactorChange) {
    return adminClientService.get(cluster)
        .flatMap(ac -> {
          Integer actual = cluster.getTopics().get(topicName).getReplicationFactor();
          Integer requested = replicationFactorChange.getTotalReplicationFactor();
          Integer brokersCount = cluster.getMetrics().getBrokerCount();

          if (requested.equals(actual)) {
            return Mono.error(
                new ValidationException(
                    String.format("Topic already has replicationFactor %s.", actual)));
          }
          if (requested > brokersCount) {
            return Mono.error(
                new ValidationException(
                    String.format("Requested replication factor %s more than brokers count %s.",
                        requested, brokersCount)));
          }
          return changeReplicationFactor(ac, topicName,
              getPartitionsReassignments(cluster, topicName,
                  replicationFactorChange));
        });
  }

  public Mono<Map<Integer, Map<String, DescribeLogDirsResponse.LogDirInfo>>> getClusterLogDirs(
      KafkaCluster cluster, List<Integer> reqBrokers) {
    return adminClientService.get(cluster)
        .flatMap(admin -> {
          List<Integer> brokers = new ArrayList<>(cluster.getBrokers());
          if (reqBrokers != null && !reqBrokers.isEmpty()) {
            brokers.retainAll(reqBrokers);
          }
          return admin.describeLogDirs(brokers);
        })
        .onErrorResume(TimeoutException.class, (TimeoutException e) -> {
          log.error("Error during fetching log dirs", e);
          return Mono.just(new HashMap<>());
        });
  }

  private Map<TopicPartition, Optional<NewPartitionReassignment>> getPartitionsReassignments(
      KafkaCluster cluster,
      String topicName,
      ReplicationFactorChangeDTO replicationFactorChange) {
    // Current assignment map (Partition number -> List of brokers)
    Map<Integer, List<Integer>> currentAssignment = getCurrentAssignment(cluster, topicName);
    // Brokers map (Broker id -> count)
    Map<Integer, Integer> brokersUsage = getBrokersMap(cluster, currentAssignment);
    int currentReplicationFactor = cluster.getTopics().get(topicName).getReplicationFactor();

    // If we should to increase Replication factor
    if (replicationFactorChange.getTotalReplicationFactor() > currentReplicationFactor) {
      // For each partition
      for (var assignmentList : currentAssignment.values()) {
        // Get brokers list sorted by usage
        var brokers = brokersUsage.entrySet().stream()
            .sorted(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        // Iterate brokers and try to add them in assignment
        // while (partition replicas count != requested replication factor)
        for (Integer broker : brokers) {
          if (!assignmentList.contains(broker)) {
            assignmentList.add(broker);
            brokersUsage.merge(broker, 1, Integer::sum);
          }
          if (assignmentList.size() == replicationFactorChange.getTotalReplicationFactor()) {
            break;
          }
        }
        if (assignmentList.size() != replicationFactorChange.getTotalReplicationFactor()) {
          throw new ValidationException("Something went wrong during adding replicas");
        }
      }

      // If we should to decrease Replication factor
    } else if (replicationFactorChange.getTotalReplicationFactor() < currentReplicationFactor) {
      for (Map.Entry<Integer, List<Integer>> assignmentEntry : currentAssignment.entrySet()) {
        var partition = assignmentEntry.getKey();
        var brokers = assignmentEntry.getValue();

        // Get brokers list sorted by usage in reverse order
        var brokersUsageList = brokersUsage.entrySet().stream()
            .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        // Iterate brokers and try to remove them from assignment
        // while (partition replicas count != requested replication factor)
        for (Integer broker : brokersUsageList) {
          // Check is the broker the leader of partition
          if (!cluster.getTopics().get(topicName).getPartitions().get(partition).getLeader()
              .equals(broker)) {
            brokers.remove(broker);
            brokersUsage.merge(broker, -1, Integer::sum);
          }
          if (brokers.size() == replicationFactorChange.getTotalReplicationFactor()) {
            break;
          }
        }
        if (brokers.size() != replicationFactorChange.getTotalReplicationFactor()) {
          throw new ValidationException("Something went wrong during removing replicas");
        }
      }
    } else {
      throw new ValidationException("Replication factor already equals requested");
    }

    // Return result map
    return currentAssignment.entrySet().stream().collect(Collectors.toMap(
        e -> new TopicPartition(topicName, e.getKey()),
        e -> Optional.of(new NewPartitionReassignment(e.getValue()))
    ));
  }

  private Map<Integer, List<Integer>> getCurrentAssignment(KafkaCluster cluster, String topicName) {
    return cluster.getTopics().get(topicName).getPartitions().values().stream()
        .collect(Collectors.toMap(
            InternalPartition::getPartition,
            p -> p.getReplicas().stream()
                .map(InternalReplica::getBroker)
                .collect(Collectors.toList())
        ));
  }

  private Map<Integer, Integer> getBrokersMap(KafkaCluster cluster,
                                              Map<Integer, List<Integer>> currentAssignment) {
    Map<Integer, Integer> result = cluster.getBrokers().stream()
        .collect(Collectors.toMap(
            c -> c,
            c -> 0
        ));
    currentAssignment.values().forEach(brokers -> brokers
        .forEach(broker -> result.put(broker, result.get(broker) + 1)));

    return result;
  }

  public Mono<Void> updateBrokerLogDir(KafkaCluster cluster, Integer broker,
                                       BrokerLogdirUpdateDTO brokerLogDir) {
    return adminClientService.get(cluster)
        .flatMap(ac -> updateBrokerLogDir(ac, brokerLogDir, broker));
  }

  private Mono<Void> updateBrokerLogDir(ReactiveAdminClient admin,
                                        BrokerLogdirUpdateDTO b,
                                        Integer broker) {

    Map<TopicPartitionReplica, String> req = Map.of(
        new TopicPartitionReplica(b.getTopic(), b.getPartition(), broker),
        b.getLogDir());
    return  admin.alterReplicaLogDirs(req)
        .onErrorResume(UnknownTopicOrPartitionException.class,
            e -> Mono.error(new TopicOrPartitionNotFoundException()))
        .onErrorResume(LogDirNotFoundException.class,
            e -> Mono.error(new LogDirNotFoundApiException()))
        .doOnError(log::error);
  }

  public Mono<Void> updateBrokerConfigByName(KafkaCluster cluster,
                                             Integer broker,
                                             String name,
                                             String value) {
    return adminClientService.get(cluster)
        .flatMap(ac -> ac.updateBrokerConfigByName(broker, name, value))
        .onErrorResume(InvalidRequestException.class,
            e -> Mono.error(new InvalidRequestApiException(e.getMessage())))
        .doOnError(log::error);
  }
}
