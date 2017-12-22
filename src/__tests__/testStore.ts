import { Action, applyMiddleware, createStore, Store } from "redux";
import createSagaMiddleware from "redux-saga";
import testReducer from "./testReducer";
import rootSaga from "./testSaga";

export type TestState = { actions?: Action[] };

const INITIAL_STATE: TestState = {};
const sagaMiddleware: any = createSagaMiddleware();

const store: Store<TestState | undefined> = createStore(
    testReducer,
    INITIAL_STATE,
    applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

export default store;
