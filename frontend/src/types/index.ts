import { AnyAction } from 'redux';
import { ActionType } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';

import * as topicsActions from 'redux/reducers/topics/actions';
import * as clustersActions from 'redux/reducers/clusters/actions';
import * as brokersActions from 'redux/reducers/brokers/actions';

import { Topic } from './topic';
import { Cluster } from './cluster';
import { Broker } from './broker';
import { LoaderState } from './loader';

export * from './topic';
export * from './cluster';
export * from './broker';
export * from './loader';

export enum FetchStatus {
  notFetched = 'notFetched',
  fetching = 'fetching',
  fetched = 'fetched',
  errorFetching = 'errorFetching',
}

export interface RootState {
  topics: Topic[];
  clusters: Cluster[];
  brokers: Broker[];
  loader: LoaderState;
}

export type Action = ActionType<typeof topicsActions | typeof clustersActions | typeof brokersActions>;

export type PromiseThunk<T> = ThunkAction<Promise<T>, RootState, undefined, AnyAction>;
