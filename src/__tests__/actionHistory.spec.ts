import { mockStoreFactory, ReduxSagaMock, runSagaMock } from "..";
import { stopSagaMock } from "..";
import testReducer from "./testReducer";
import { watcher } from "./testSaga";
import testStore from "./testStore";

describe("actionHistory", () => {
    it("Should register dispatched actions, 1", async () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore);
        const expected: string = "bla";

        // Act
        const done = runSagaMock(mock, watcher);
        mock.mockStore.dispatch({ type: expected });

        stopSagaMock(mock);
        await done;

        // Assert
        // tslint:disable-next-line:no-console
        expect(mock.actionHistory.length).toBe(1);
        expect(mock.actionHistory.filter((x) => x.type === expected).length).toBe(1);
    });

    it("Should register dispatched actions, 2", async () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore);
        const expected: string = "bla";

        // Act
        const done = runSagaMock(mock, watcher);
        mock.mockStore.dispatch({ type: expected });
        mock.mockStore.dispatch({ type: "mlkjmkl" });

        stopSagaMock(mock);
        await done;

        // Assert
        expect(mock.actionHistory.length).toBe(2);
        expect(mock.actionHistory.filter((x) => x.type === expected).length).toBe(1);
    });
});
