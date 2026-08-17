import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLecturesByFilter,
} from "../../Lectures/api/lecturesService";
import type { LecturePopulated, LectureFilters } from "../types";


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