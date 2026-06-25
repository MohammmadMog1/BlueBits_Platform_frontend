import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loginApi, registerApi, logoutApi, getMeApi } from "../api/authApi";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

// Login Thunk (لا يحتاج تعديل، لأن الـ Login يرجع { token, user } داخل data)
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginRequest, thunkAPI) => {
    try {
      const response = await loginApi({ email, password });
      const token = response.data.token;
      const user = response.data.user;

      if (token) {
        localStorage.setItem("token", token);
      }

      return { user, token };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      } else {
        return thunkAPI.rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Register Thunk
export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }: RegisterRequest, thunkAPI) => {
    try {
      const response = await registerApi({ name, email, password });
      
      // ✅ التصحيح: response.data هو الـ User مباشرة
      const user = response.data; 
      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      } else {
        return thunkAPI.rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// GetMe Thunk
export const getMeThunk = createAsyncThunk(
  "auth/getMe",
  async (_, thunkAPI) => {
    try {
      const response = await getMeApi();
      
      // ✅ التصحيح: response.data هو الـ User مباشرة
      const user = response.data;
      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      } else {
        return thunkAPI.rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Logout Thunk (لا يحتاج تعديل)
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      return null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      } else {
        return thunkAPI.rejectWithValue("An unexpected error occurred");
      }
    }
  }
);