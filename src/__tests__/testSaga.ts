import { takeEvery } from "redux-saga";
import { fork, ForkEffect, select } from "redux-saga/effects";

export const ACTION: string = "ACTION";

function* worker() {
    yield select((x) => x);
}

export function* watcher(): IterableIterator<any> {
    yield takeEvery(ACTION, worker);
}

export default function* rootSaga(): IterableIterator<ForkEffect[]> {
    yield [
        fork(watcher),
    ];
}
