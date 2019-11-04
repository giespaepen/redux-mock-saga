import { Action, applyMiddleware, createStore, Store } from "redux";
import createSagaMiddleware, { END, SagaMiddleware, Task } from "redux-saga";
import { all, fork } from "redux-saga/effects";

export type ReduxSagaMock = { mockStore: Store<any>, mockSagaMiddleWare: SagaMiddleware<{}>, actionHistory: Action[] };

/**
 * This factory creates a mocked store object object and an instance
 * of the saga middleware.
 *
 * @param {*} rootReducer
 * @param {*} store
 */
export function mockStoreFactory(rootReducer: any, store: Store<any>, state?: any): ReduxSagaMock {
    if (!rootReducer || !store) {
        throw new Error("rootReducer and store must be defined");
    }

    // Create the action history
    const actionHistory: Action[] = [];

    // Create a root saga and middleware
    const mockSagaMiddleWare: SagaMiddleware<any> = createSagaMiddleware();

    // Create the store and provide the following elements:
    const mockStore: Store<any> = createStore(
        // 1) the root reducer, a barrel of all individual reducers of every state property
        rootReducer,

        // 2) the initial state of the application (an empty object)
        state || {},

        // 3) compose store enhancers consisting of:
        applyMiddleware(
            // Custom middleware to log the actions
            function logHistory({ getState }) {
                return (next) => (action) => {
                    if (action.type && action.type.indexOf("@@redux-saga") === -1) {
                        actionHistory.push(action);
                    }
                    return next(action);
                };
            },
            // The mocked saga middleware
            mockSagaMiddleWare,
        ),
    );

    attachMockedStore(store, mockStore);

    // The constructed store is exported. So if you import the store you get the concrete
    // instance.
    return { mockStore, mockSagaMiddleWare, actionHistory };
}

/**
 * It happens to be that sagas use yield select(state => state.x) statements, thus using
 * the real store. This function attaches the mocked store to the real functions via jest
 * mock APIs.
 *
 * @param {*} store
 * @param {*} mockStore
 */
function attachMockedStore(store: Store<any>, mockStore: Store<any>): void {
    store.getState = jest.fn().mockImplementation(mockStore.getState);
    store.dispatch = jest.fn().mockImplementation(mockStore.dispatch);
    store.subscribe = jest.fn().mockImplementation((listener) => { mockStore.subscribe(listener); });
    store.replaceReducer = jest.fn().mockImplementation((next: any) => { mockStore.replaceReducer(next); });
}

/**
 * Sagas always start with a root saga where all the other sagas are forked.
 * @param {*} sagas
 */
export function createMockRootSaga(...sagas: any[]): any {
    return function* rootSaga() {
        yield all([
            ...sagas.map((x) => fork(x)),
        ]);
    };
}

/**
 * Run the sagas against the configured mock saga middleware. Return the done promise to await
 * in your tests.
 *
 * @param mock
 * @param sagas
 */
export function runSagaMock(mock: ReduxSagaMock, ...sagas: any[]): Task {
    if (!mock) {
        throw new Error("mock should be defined");
    }

    return mock.mockSagaMiddleWare.run(createMockRootSaga(...sagas));
}

/**
 * Stop a saga mock by dispatching the END signal. Don't forget to await the promise returned
 * in runSagaMock.
 *
 * @param mock
 */
export function stopSagaMock(mock: ReduxSagaMock): void {
    if (!mock) {
        throw new Error("mock should be defined");
    }
    setTimeout(() => mock.mockStore.dispatch(END), 250);
}
