import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";

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

export type RootState = ReturnType<typeof reducers>;

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredActionPaths: ['payload.register', 'payload.rehydrate'],
            },
        }),
});

const persistor = persistStore(store);

export {store, persistor};
