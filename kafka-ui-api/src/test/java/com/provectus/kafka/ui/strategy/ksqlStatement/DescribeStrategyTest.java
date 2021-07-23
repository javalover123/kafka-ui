package com.provectus.kafka.ui.strategy.ksqlStatement;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.provectus.kafka.ui.exception.UnprocessableEntityException;
import com.provectus.kafka.ui.model.KsqlCommandResponse;
import com.provectus.kafka.ui.model.Table;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class DescribeStrategyTest {
    private KsqlStatementStrategy ksqlStatementStrategy;
    private ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        ksqlStatementStrategy = new DescribeStrategy();
    }

    @Test
    public void shouldReturnUri() {
        ksqlStatementStrategy.host("ksqldb-server:8088");
        assertThat(ksqlStatementStrategy.getUri()).isEqualTo("ksqldb-server:8088/ksql");
    }

    @Test
    public void shouldReturnTrueInTest() {
        assertTrue(ksqlStatementStrategy.test("DESCRIBE users;"));
        assertTrue(ksqlStatementStrategy.test("DESCRIBE EXTENDED users;"));
    }

    @Test
    public void shouldReturnFalseInTest() {
        assertFalse(ksqlStatementStrategy.test("list streams;"));
        assertFalse(ksqlStatementStrategy.test("show tables;"));
    }

    @Test
    public void shouldSerializeResponse() {
        JsonNode node = getResponseWithObjectNode();
        KsqlCommandResponse serializedResponse = ksqlStatementStrategy.serializeResponse(node);
        Table table = serializedResponse.getData();
        assertThat(table.getHeaders()).isEqualTo(List.of("key", "value"));
        assertThat(table.getRows()).isEqualTo(List.of(List.of("name", "kafka")));
    }

    @Test
    public void shouldSerializeWithException() {
        JsonNode sourceDescriptionNode = mapper.createObjectNode().put("sourceDescription", "nodeWithMessage");
        JsonNode node = mapper.createArrayNode().add(mapper.valueToTree(sourceDescriptionNode));
        Exception exception = assertThrows(
                UnprocessableEntityException.class,
                () -> ksqlStatementStrategy.serializeResponse(node)
        );

        assertThat(exception.getMessage()).isEqualTo("KSQL DB response mapping error");
    }

    @SneakyThrows
    private JsonNode getResponseWithObjectNode() {
        JsonNode nodeWithMessage = mapper.createObjectNode().put("name", "kafka");
        JsonNode nodeWithResponse = mapper.createObjectNode().set("sourceDescription", nodeWithMessage);
        return mapper.createArrayNode().add(mapper.valueToTree(nodeWithResponse));
    }
}
