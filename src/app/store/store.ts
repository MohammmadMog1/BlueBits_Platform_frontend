import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userLecturesReducer from "../../features/user/lectures/redux/lecturesSlice";
// ...

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
import { academicApi } from "../../features/admin/academic/api/academicApi";
import { subjectsApi } from "../../features/admin/subjects/api/subjectsApi";
import lecturesReducer from "../../features/admin/lectures/redux/lecturesSlice";

// ✅ الحل: إنشاء Storage Engine مخصص يتجاوز مشاكل الـ Bundler في Vite
const customStorage = {
  getItem: async (key: string) => {
    return localStorage.getItem(key);
  },
  setItem: async (key: string, item: string) => {
    localStorage.setItem(key, item);
  },
  removeItem: async (key: string) => {
    localStorage.removeItem(key);
  },
};

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  lectures: lecturesReducer,
  userLectures: userLecturesReducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [academicApi.reducerPath]: academicApi.reducer,
  [subjectsApi.reducerPath]: subjectsApi.reducer,
  [academicTasksApi.reducerPath]: academicTasksApi.reducer,
  // ✨ جديد: تسجيل reducer الخاص بـ profileApi
  [profileApi.reducerPath]: profileApi.reducer,
  [aiApi.reducerPath]: aiApi.reducer,
  [personalTasksApi.reducerPath]: personalTasksApi.reducer,
  [announcementsApi.reducerPath]: announcementsApi.reducer,
});

const persistConfig = {
  key: "root",
  storage: customStorage,
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
    }).concat(
      usersApi.middleware,
      academicApi.middleware,
      subjectsApi.middleware,
      academicTasksApi.middleware,
      // ✨ جديد: تسجيل middleware الخاص بـ profileApi
      profileApi.middleware,
      aiApi.middleware,
      personalTasksApi.middleware,
      announcementsApi.middleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;