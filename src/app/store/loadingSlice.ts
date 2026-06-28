import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
  pendingRequests: number;
}

const initialState: LoadingState = {
  isLoading: false,
  pendingRequests: 0,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.pendingRequests += 1;
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
      state.isLoading = state.pendingRequests > 0;
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
