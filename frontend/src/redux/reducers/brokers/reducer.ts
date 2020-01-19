import { Action, BrokersState, ZooKeeperStatus, BrokerMetrics } from 'lib/interfaces';
import actionType from 'redux/reducers/actionType';

export const initialState: BrokersState =  {
  items: [],
  brokerCount: 0,
  zooKeeperStatus: ZooKeeperStatus.offline,
  activeControllers: 0,
  networkPoolUsage: 0,
  requestPoolUsage: 0,
  onlinePartitionCount: 0,
  offlinePartitionCount: 0,
  underReplicatedPartitionCount: 0,
  diskUsageDistribution: undefined,
  diskUsage: [],
};

const updateBrokerSegmentSize = (state: BrokersState, payload: BrokerMetrics) => {
  const brokers = state.items;
  const { diskUsage } = payload;

  const items = brokers.map((broker) => {
    const brokerMetrics = diskUsage.find(({ brokerId }) => brokerId === broker.brokerId);
    if (brokerMetrics !== undefined) {
      return { ...broker, ...brokerMetrics };
    }
    return broker;
  });

  return { ...state, items, ...payload };
};

const reducer = (state = initialState, action: Action): BrokersState => {
  switch (action.type) {
    case actionType.GET_BROKERS__REQUEST:
      return initialState;
    case actionType.GET_BROKERS__SUCCESS:
      return {
        ...state,
        items: action.payload,
      };
    case actionType.GET_BROKER_METRICS__SUCCESS:
      return updateBrokerSegmentSize(state, action.payload);
    default:
      return state;
  }
};

export default reducer;
