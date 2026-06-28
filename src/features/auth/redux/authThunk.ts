import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loginApi, registerApi, logoutApi, getMeApi } from "../api/authApi";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginRequest, thunkAPI) => {
    try {
      const response = await loginApi({ email, password });
      const token = response.data.token;
      const user = response.data.user;

      return { user, token };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      }

      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }: RegisterRequest, thunkAPI) => {
    try {
      const response = await registerApi({ name, email, password });
      const user = response.data;
      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      }

      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

export const getMeThunk = createAsyncThunk(
  "auth/getMe",
  async (_, thunkAPI) => {
    try {
      const response = await getMeApi();
      const user = response.data;
      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      }

      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      return null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      }

      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);