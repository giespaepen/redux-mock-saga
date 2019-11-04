import { mockStoreFactory, ReduxSagaMock, runSagaMock } from "..";
import testReducer from "./testReducer";
import { watcher } from "./testSaga";
import testStore from "./testStore";

describe("runSagaMock", () => {
    it("Should run the saga middleware", () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore);

        // Act
        const done = runSagaMock(mock, watcher);

        // Assert
        expect(done).not.toBeNull();
    });

    it("Should should throw an error when mock is null", () => {
        // Arrange
        const expected = true;
        let actual = false;
        mockStoreFactory(testReducer, testStore);

        try {
            // Act
            runSagaMock(null as any, watcher);
        } catch {
            actual = true;
        }

        // Assert
        expect(actual).toBe(expected);
    });
});
