var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_saga_1 = require("redux-saga");
var effects_1 = require("redux-saga/effects");
/**
 * This factory creates a mocked store object object and an instance
 * of the saga middleware.
 *
 * @param {*} rootReducer
 * @param {*} store
 */
function mockStoreFactory(rootReducer, store, state) {
    if (!rootReducer || !store) {
        throw new Error("rootReducer and store must be defined");
    }
    // Create the action history
    var actionHistory = [];
    // Create a root saga and middleware
    var mockSagaMiddleWare = redux_saga_1.default();
    // Create the store and provide the following elements:
    var mockStore = redux_1.createStore(
    // 1) the root reducer, a barrel of all individual reducers of every state property
    rootReducer, 
    // 2) the initial state of the application (an empty object)
    state || {}, 
    // 3) compose store enhancers consisting of:
    redux_1.applyMiddleware(
    // Custom middleware to log the actions
    function logHistory(_a) {
        var getState = _a.getState;
        return function (next) { return function (action) {
            if (action.type && action.type.indexOf("@@redux-saga") === -1) {
                actionHistory.push(action);
            }
            return next(action);
        }; };
    }, 
    // The mocked saga middleware
    mockSagaMiddleWare));
    attachMockedStore(store, mockStore);
    // The constructed store is exported. So if you import the store you get the concrete
    // instance.
    return { mockStore: mockStore, mockSagaMiddleWare: mockSagaMiddleWare, actionHistory: actionHistory };
}
exports.mockStoreFactory = mockStoreFactory;
/**
 * It happens to be that sagas use yield select(state => state.x) statements, thus using
 * the real store. This function attaches the mocked store to the real functions via jest
 * mock APIs.
 *
 * @param {*} store
 * @param {*} mockStore
 */
function attachMockedStore(store, mockStore) {
    store.getState = jest.fn().mockImplementation(mockStore.getState);
    store.dispatch = jest.fn().mockImplementation(mockStore.dispatch);
    store.subscribe = jest.fn().mockImplementation(function (listener) { mockStore.subscribe(listener); });
    store.replaceReducer = jest.fn().mockImplementation(function (next) { mockStore.replaceReducer(next); });
}
/**
 * Sagas always start with a root saga where all the other sagas are forked.
 * @param {*} sagas
 */
function createMockRootSaga() {
    var sagas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sagas[_i] = arguments[_i];
    }
    return function rootSaga() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects_1.all(__spreadArrays(sagas.map(function (x) { return effects_1.fork(x); })))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
}
exports.createMockRootSaga = createMockRootSaga;
/**
 * Run the sagas against the configured mock saga middleware. Return the done promise to await
 * in your tests.
 *
 * @param mock
 * @param sagas
 */
function runSagaMock(mock) {
    var sagas = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sagas[_i - 1] = arguments[_i];
    }
    if (!mock) {
        throw new Error("mock should be defined");
    }
    return mock.mockSagaMiddleWare.run(createMockRootSaga.apply(void 0, sagas));
}
exports.runSagaMock = runSagaMock;
/**
 * Stop a saga mock by dispatching the END signal. Don't forget to await the promise returned
 * in runSagaMock.
 *
 * @param mock
 */
function stopSagaMock(mock) {
    if (!mock) {
        throw new Error("mock should be defined");
    }
    setTimeout(function () { return mock.mockStore.dispatch(redux_saga_1.END); }, 250);
}
exports.stopSagaMock = stopSagaMock;
//# sourceMappingURL=index.js.map