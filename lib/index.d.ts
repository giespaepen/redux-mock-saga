import { Action, Store } from "redux";
import { SagaMiddleware, Task } from "redux-saga";
export declare type ReduxSagaMock = {
    mockStore: Store<any>;
    mockSagaMiddleWare: SagaMiddleware<{}>;
    actionHistory: Action[];
};
/**
 * This factory creates a mocked store object object and an instance
 * of the saga middleware.
 *
 * @param {*} rootReducer
 * @param {*} store
 */
export declare function mockStoreFactory(rootReducer: any, store: Store<any>, state?: any): ReduxSagaMock;
/**
 * Sagas always start with a root saga where all the other sagas are forked.
 * @param {*} sagas
 */
export declare function createMockRootSaga(...sagas: any[]): any;
/**
 * Run the sagas against the configured mock saga middleware. Return the done promise to await
 * in your tests.
 *
 * @param mock
 * @param sagas
 */
export declare function runSagaMock(mock: ReduxSagaMock, ...sagas: any[]): Task;
/**
 * Stop a saga mock by dispatching the END signal. Don't forget to await the promise returned
 * in runSagaMock.
 *
 * @param mock
 */
export declare function stopSagaMock(mock: ReduxSagaMock): void;
