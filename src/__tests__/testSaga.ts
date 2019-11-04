import { fork, ForkEffect, select, takeLatest } from "redux-saga/effects";

export const ACTION: string = "ACTION";

function* worker() {
    console.log("Working saga");
    yield select((x) => x);
}

export function* watcher(): IterableIterator<any> {
    yield takeLatest(ACTION, worker);
}

export default function* rootSaga(): IterableIterator<ForkEffect[]> {
    yield [
        fork(watcher),
    ];
}
