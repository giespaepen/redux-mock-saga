[![Build Status](https://travis-ci.org/giespaepen/redux-mock-saga.svg?branch=master)](https://travis-ci.org/giespaepen/redux-mock-saga)
[![Dependencies](https://david-dm.org/giespaepen/redux-mock-saga)](https://david-dm.org/giespaepen/redux-mock-saga.svg)
[![NPM Version](https://badge.fury.io/js/redux-mock-saga.svg)](https://badge.fury.io/js/redux-mock-saga)

# Redux-Saga-Mock
> Elegant testing strategy to check what your saga's really do, i.e. testing the result of the side effects.

## Why?
There are different strategies for saga testing. Some use snapshots, others check what's in the generator. Or in many projects, they are untested altogether.

I found many testing strategies insuficient where I just wanted to test the saga as a function: `f(saga, params) => [state, side-effects]`.

### What it does
This library helps you to setup a full functional SagaMiddleware with a mocked store and a custom state. 

### What it doesn't
However it doesn't help you mock all the side effects like API-calls, and other objects which you need. A test might be simple, the amount of fixtures can be complicated.

## Test setup
What do you need?

- Jest
- This package
- App using redux and redux-saga

(All samples in Typescript/Flow)

```javascript

import { mockStoreFactory, ReduxSagaMock, runSagaMock, stopSagaMock } from "redux-saga-mock";

describe("some saga", () => {
    // Declare test-wide variables
    let sagaMock: ReduxSagaMock;

    beforeEach(() => {
        // Create the middleware and mockStore, provide the effective store used in your application
        // and an initial state (optional)
        sagaMock = mockStoreFactory(rootReducer, store, someInitialState);
    });

    it("Base test", async () => {
        // Arrange
        const done = runSagaMock(sagaMock, yourSagaToTest);
        // const done = runSagaMock(sagaMock, yourSagaToTest, someOtherSagaToTest,...)

        // Act ... dispatch actions ...
        // sagaMock.mockStore.dispatch(createSomeAction(...));

        // Await
        stopSagaMock(sagaMock);
        await done;

        // Assert ... assert calls on api, state changes ...
    });
});

```

Let's split that in parts. First of all the the mock is generated via `mockStoreFactory` before every test.
The `mockStoreFactory` returns an ReduxSagaMock object containing:

- `mockSagaMiddleware`: Mocked saga middleware.
- `mockStore`: the mocked store object. Use this object to get the state `mockStore.getState()` to assert state changes

Then you start testing sagas. Also remark that the test method should be **async**! There are a few obligatory things in a test. First you should start the sagas to test via `runSagaMock`. Provide the factory-generated mock `sagaMock` and the saga (worker) you want to test. You get a promise in return. Read on.

Then you can dispatch whatever you want to trigger the running saga. After you dispatched your actions the running saga middleware must be told to stop. Thats done in the **await** block above. `stopSagaMock` to dispatch the **END** signal. Then await the promise `done`.

Finally, you can assert the results. 

## Typings
The project provides Typescript and Flow typings.
