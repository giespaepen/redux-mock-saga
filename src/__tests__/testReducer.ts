import { Action } from "redux";
import { TestState } from "./testStore";

export default function(state: TestState = {}, action: Action): TestState {
    return {
        ...state,
        actions: [...(state.actions ? state.actions : []), action],
    };
}
