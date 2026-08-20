import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLecturesByFilter,
} from "../../Lectures/api/lecturesService";
import type { LecturePopulated, LectureFilters } from "../types";


/** رسالة الخطأ من الخادم، أو نص فارغ ليستخدم المكوّن رسالةً مترجَمة بديلة */
const formatError = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const anyError = error as any;
    return anyError.response?.data?.message ?? anyError.message ?? "";
  }
  return "";
};

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