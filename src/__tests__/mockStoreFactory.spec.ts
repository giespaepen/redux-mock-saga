import { mockStoreFactory, ReduxSagaMock } from "../index";
import testReducer from "./testReducer";
import testStore from "./testStore";

describe("mockStoreFactory", () => {
    it("Should create a mock object", () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore);

        // Assert
        expect(mock.mockSagaMiddleWare).not.toBeNull();
        expect(mock.mockStore).not.toBeNull();
    });

    it("Should create a default state", () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore);

        // Assert
        expect(Object.keys(mock.mockStore.getState()).length).toBe(1);
    });

    it("Should pass an initial state", () => {
        // Arrange
        const mock: ReduxSagaMock = mockStoreFactory(testReducer, testStore, { foo: "bar" });

        // Assert
        expect(mock.mockStore.getState().foo).toBe("bar");
    });

    it("Should should throw an error when rootReducer is null", () => {
        // Arrange
        const expected = true;
        let actual = false;

        try {
            mockStoreFactory(null, testStore, { foo: "bar" });
        } catch {
            actual = true;
        }

        // Assert
        expect(actual).toBe(expected);
    });

    it("Should should throw an error when testStore is null", () => {
        // Arrange
        const expected = true;
        let actual = false;

        try {
            mockStoreFactory(testReducer, null as any, { foo: "bar" });
        } catch {
            actual = true;
        }

        // Assert
        expect(actual).toBe(expected);
    });
});
