import { mockStoreFactory, ReduxSagaMock, runSagaMock, stopSagaMock } from "../index";
import testReducer from "./testReducer";
import { watcher } from "./testSaga";
import testStore from "./testStore";

describe("stopSagaMock", () => {
    it("Should stop the running saga middleware", async () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore);
        let expected = false;

        // Act
        const done = runSagaMock(mock, watcher);
        done.then(() => { expected = true; });

        stopSagaMock(mock);
        await done;

        // Assert
        expect(done).not.toBeNull();
        expect(expected).toBeTruthy();
    });

    it("Should should throw an error when mock is null", () => {
        // Arrange
        const expected = true;
        let actual = false;
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore);

        try {
            // Act
            runSagaMock(mock, watcher);
            stopSagaMock(null as any);
        } catch {
            actual = true;
            stopSagaMock(mock);
        }

        // Assert
        expect(actual).toBe(expected);
    });
});
