import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteLecture,
  fetchLecturesByFilter,
  updateLecture,
  uploadLecture,
} from "../api/lecturesService";
import type {
  Lecture,
  LectureFilters,
  LectureUpdatePayload,
  LectureUploadPayload,
} from "../types";
import { setUploadProgress } from "./lecturesSlice";

const formatError = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const anyError = error as any;
    return (
      anyError.response?.data?.message ??
      anyError.message ??
      "تعذر إكمال الطلب."
    );
  }
  return "تعذر إكمال الطلب.";
};

export const fetchLecturesThunk = createAsyncThunk<
  Lecture[],
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

export const uploadLectureThunk = createAsyncThunk<
  Lecture,
  LectureUploadPayload,
  { rejectValue: string }
>("lectures/upload", async (payload, thunkAPI) => {
  try {
    const lecture = await uploadLecture(payload, (progress) => {
      thunkAPI.dispatch(setUploadProgress(progress));
    });
    return lecture;
  } catch (error) {
    return thunkAPI.rejectWithValue(formatError(error));
  }
});

export const updateLectureThunk = createAsyncThunk<
  Lecture,
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
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(formatError(error));
  }
});
