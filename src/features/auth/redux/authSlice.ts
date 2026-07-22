import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../types/auth.types";
import {
  loginThunk,
  registerThunk,
  getMeThunk,
  logoutThunk,
  forgotPasswordThunk,
  resetPasswordThunk
} from "./authThunk";
// import { buildErrorMessage } from "vite";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.token = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(getMeThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMeThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

       builder
  .addCase(forgotPasswordThunk.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(forgotPasswordThunk.fulfilled, (state) => {
    state.isLoading = false;
  })
  .addCase(forgotPasswordThunk.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
  });

builder
  .addCase(resetPasswordThunk.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })

  .addCase(resetPasswordThunk.fulfilled, (state) => {
    state.isLoading = false;
  })

  .addCase(resetPasswordThunk.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
  });
  
  },
});




export const { logout } = authSlice.actions;
export default authSlice.reducer;
