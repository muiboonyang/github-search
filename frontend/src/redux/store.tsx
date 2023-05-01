import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import loadingSlice from "./loadingSlice";
import userSlice from "./userSlice";

const reducers = combineReducers({
  loading: loadingSlice,
  user: userSlice,
});

////////////////////////////////

// To persist the store data even if user navigates away from the page
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export type RootState = ReturnType<typeof reducers>;

export default store;
