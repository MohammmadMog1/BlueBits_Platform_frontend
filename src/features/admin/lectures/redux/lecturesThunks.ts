import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteLecture,
  fetchLecturesByFilter,
  updateLecture,
  uploadLecture,
  getLecture, // ✅ إضافة import
} from "../api/lecturesService";
import type {
  LecturePopulated, // ✅ تغيير من Lecture
  LectureFilters,
  LectureUpdatePayload,
  LectureUploadPayload,
} from "../types";
import { setUploadProgress } from "./lecturesSlice";
import { lecturesStatsApi } from "../api/lecturesStatsApi";

/** رسالة الخطأ من الخادم، أو نص فارغ ليستخدم المكوّن رسالةً مترجَمة بديلة */
const formatError = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const anyError = error as any;
    return anyError.response?.data?.message ?? anyError.message ?? "";
  }
  return "";
};

// ✅ تغيير نوع الـ return إلى LecturePopulated[]
export const fetchLecturesThunk = createAsyncThunk<
  LecturePopulated[],
  LectureFilters,
  { rejectValue: string }
>("lectures/fetch", async (filters, thunkAPI) => {
  try {
    const lectures = await fetchLecturesByFilter(filters);
    return lectures;
  } catch (error) {
    return thunkAPI.rejectWithValue(formatError(error));
  }
});

// ✅ تغيير نوع الـ return إلى LecturePopulated
export const uploadLectureThunk = createAsyncThunk<
  LecturePopulated,
  LectureUploadPayload,
  { rejectValue: string }
>("lectures/upload", async (payload, thunkAPI) => {
  try {
    // الـ API يرجع Lecture (غير populated)
    const lecture = await uploadLecture(payload, (progress) => {
      thunkAPI.dispatch(setUploadProgress(progress));
    });
    
    // ✅ نجلب المحاضرة الكاملة (populated) باستخدام الـ id
    const fullLecture = await getLecture(lecture._id);
    thunkAPI.dispatch(
      lecturesStatsApi.util.invalidateTags([{ type: "LectureStats", id: "LIST" }]),
    );
    return fullLecture;
  } catch (error) {
    return thunkAPI.rejectWithValue(formatError(error));
  }
});

// ✅ تغيير نوع الـ return إلى LecturePopulated
export const updateLectureThunk = createAsyncThunk<
  LecturePopulated,
  LectureUpdatePayload,
  { rejectValue: string }
>("lectures/update", async ({ id, data }, thunkAPI) => {
  try {
    const lecture = await updateLecture(id, data);
    return lecture;
  } catch (error) {
    return thunkAPI.rejectWithValue(formatError(error));
  }
});

export const deleteLectureThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("lectures/delete", async (id, thunkAPI) => {
  try {
    await deleteLecture(id);
    thunkAPI.dispatch(
      lecturesStatsApi.util.invalidateTags([{ type: "LectureStats", id: "LIST" }]),
    );
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(formatError(error));
  }
});