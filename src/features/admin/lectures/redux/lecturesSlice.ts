import { createSlice } from "@reduxjs/toolkit";
import type { LecturePopulated } from "../types";
import {
  deleteLectureThunk,
  fetchLecturesThunk,
  updateLectureThunk,
  uploadLectureThunk,
} from "./lecturesThunks";

export interface LecturesState {
  // ✅ تغيير من Lecture[] إلى LecturePopulated[]
  items: LecturePopulated[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadProgress: number;
  error: string | null;
}

const initialState: LecturesState = {
  items: [],
  fetchStatus: "idle",
  uploadStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  uploadProgress: 0,
  error: null,
};

const lecturesSlice = createSlice({
  name: "lectures",
  initialState,
  reducers: {
    setUploadProgress: (state, action: { payload: number }) => {
      state.uploadProgress = action.payload;
    },
    resetLectureState: (state) => {
      state.uploadStatus = "idle";
      state.updateStatus = "idle";
      state.deleteStatus = "idle";
      state.uploadProgress = 0;
      state.error = null;
    },
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
      })
      .addCase(uploadLectureThunk.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadLectureThunk.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        // ✅ الآن action.payload هو LecturePopulated
        state.items.unshift(action.payload);
        state.uploadProgress = 100;
      })
      .addCase(uploadLectureThunk.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateLectureThunk.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateLectureThunk.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateLectureThunk.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteLectureThunk.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })
      .addCase(deleteLectureThunk.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteLectureThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setUploadProgress, resetLectureState, clearLectureError } =
  lecturesSlice.actions;
export default lecturesSlice.reducer;