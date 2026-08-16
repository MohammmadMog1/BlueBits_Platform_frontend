import { createSlice } from "@reduxjs/toolkit";
import type { LecturePopulated } from "../types";
import { fetchLecturesThunk } from "./lecturesThunks";

export interface UserLecturesState {
  items: LecturePopulated[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserLecturesState = {
  items: [],
  fetchStatus: "idle",
  error: null,
};

const userLecturesSlice = createSlice({
  name: "userLectures",
  initialState,
  reducers: {
    clearLectureError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLecturesThunk.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchLecturesThunk.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchLecturesThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearLectureError } = userLecturesSlice.actions;
export default userLecturesSlice.reducer;