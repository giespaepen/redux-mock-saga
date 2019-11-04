import { mockStoreFactory, ReduxSagaMock, runSagaMock, stopSagaMock } from "..";
import testReducer from "./testReducer";
import { ACTION, watcher } from "./testSaga";
import testStore from "./testStore";

describe("full tests", () => {
    it("Test with dispatch", async () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore);
        let expected = false;

        // Act
        const done = runSagaMock(mock, watcher);
        done.toPromise().then(() => { expected = true; });

        mock.mockStore.dispatch({ type: ACTION });

        stopSagaMock(mock);
        await done.toPromise();

        // Assert
        expect(done).not.toBeNull();
        expect(expected).toBeTruthy();
        expect(mock.mockStore.getState().actions.filter((x: any) => x.type === ACTION).length).toBe(1);
    });

    it("Test with dispatch", async () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore, {});
        let expected = false;

        // Act
        const done = runSagaMock(mock, watcher);
        done.toPromise().then(() => { expected = true; });

        mock.mockStore.dispatch({ type: ACTION });
        mock.mockStore.dispatch({ type: ACTION });

        stopSagaMock(mock);
        await done.toPromise();

        // Assert
        expect(done).not.toBeNull();
        expect(expected).toBeTruthy();
        expect(mock.mockStore.getState().actions.filter((x: any) => x.type === ACTION).length).toBe(2);
    });
});
