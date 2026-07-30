import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "../../features/auth/redux/authSlice";
import loadingReducer from "./loadingSlice";
import { usersApi } from "../../features/users/api/usersApiSlice";

// ✅ الحل: إنشاء Storage Engine مخصص يتجاوز مشاكل الـ Bundler في Vite
const customStorage = {
  getItem: async (key: string) => {
    return localStorage.getItem(key);
  },
  setItem: async (key: string, item: any) => {
    localStorage.setItem(key, item);
  },
  removeItem: async (key: string) => {
    localStorage.removeItem(key);
  },
};

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  [usersApi.reducerPath]: usersApi.reducer,
});

const persistConfig = {
  key: "root",
  storage: customStorage, // ✅ استخدام الـ customStorage بدلاً من الاستيراد القديم
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(usersApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;