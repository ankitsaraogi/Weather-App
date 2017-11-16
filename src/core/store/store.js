
import { createStore, applyMiddleware } from "redux";
import Middleware from "./middleware";
import reducers from "./root-reducer";

const createStoreWithMiddleware = applyMiddleware(...Middleware)(createStore);
export const Store = createStoreWithMiddleware(reducers);
