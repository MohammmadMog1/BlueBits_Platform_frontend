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
import { academicApi } from "../../features/admin/academic/api/academicApi";
import { subjectsApi } from "../../features/admin/subjects/api/subjectsApi";
import { academicTasksApi } from "../../features/admin/tasks/api/academicTasksApi";
import { lecturesStatsApi } from "../../features/admin/lectures/api/lecturesStatsApi";
import { userLecturesApi } from "../../features/user/Lectures/api/userLecturesApi";
import lecturesReducer from "../../features/admin/lectures/redux/lecturesSlice";
import userLecturesReducer from "../../features/user/Lectures/redux/lecturesSlice";
// ✨ جديد: إضافة profileApi
import { profileApi } from "../../features/profile/api/profileApi";
import { aiApi } from "../../features/ai/api/aiApi";
import { personalTasksApi } from "../../features/personalTasks/api/personalTasksApi";
import { announcementsApi } from "../../features/admin/announcements/api/announcementsApi";
import { commentsApi } from "../../features/user/Lectures/interactions/api/commentsApi";
import { reactionsApi } from "../../features/user/Lectures/interactions/api/reactionsApi";
import { questionBanksApi } from "../../features/admin/questionBanks/api/questionBanksApi";
import { scheduleApi } from "../../features/admin/schedule/api/scheduleApi";
import { surveysApi } from "../../features/admin/surveys/api/surveysApi";

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
  [lecturesStatsApi.reducerPath]: lecturesStatsApi.reducer,
  [userLecturesApi.reducerPath]: userLecturesApi.reducer,
  // ✨ جديد: تسجيل reducer الخاص بـ profileApi
  [profileApi.reducerPath]: profileApi.reducer,
  [aiApi.reducerPath]: aiApi.reducer,
  [personalTasksApi.reducerPath]: personalTasksApi.reducer,
  [announcementsApi.reducerPath]: announcementsApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
  [reactionsApi.reducerPath]: reactionsApi.reducer,
  [questionBanksApi.reducerPath]: questionBanksApi.reducer,
  [scheduleApi.reducerPath]: scheduleApi.reducer,
  [surveysApi.reducerPath]: surveysApi.reducer,
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
      lecturesStatsApi.middleware,
      userLecturesApi.middleware,
      // ✨ جديد: تسجيل middleware الخاص بـ profileApi
      profileApi.middleware,
      aiApi.middleware,
      personalTasksApi.middleware,
      announcementsApi.middleware,
      commentsApi.middleware,
      reactionsApi.middleware,
      questionBanksApi.middleware,
      scheduleApi.middleware,
      surveysApi.middleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;