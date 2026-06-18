import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { loginApi, registerApi, logoutApi, getMeApi } from "../api/authApi";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

//Login Thunk
export const loginThunk = createAsyncThunk(
  "auth/login",

  async (
    { email, password }: LoginRequest,

    thunkAPI,
  ) => {
    try {
      const response = await loginApi({ email, password });
      console.log(response.data);

      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      } else {
        return thunkAPI.rejectWithValue("An unexpected error occurred");
      }
    }
  },
);

//register Thunk
export const registerThunk = createAsyncThunk(
  "auth/register",

  async (
    { name, email, password }: RegisterRequest,

    thunkAPI,
  ) => {
    try {
      const response = await registerApi({ name, email, password });
      console.log(response.data);
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      } else {
        return thunkAPI.rejectWithValue("An unexpected error occurred");
      }
    }
  },
);

//getMe Thunk
export const getMeThunk = createAsyncThunk(
  "auth/getMe",

  async (_, thunkAPI) => {
    try {
      const response = await getMeApi();
      console.log(response.data);
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      } else {
        return thunkAPI.rejectWithValue("An unexpected error occurred");
      }
    }
  },
);


//logout Thunk
export const logoutThunk = createAsyncThunk(
  "auth/logout",

  async (_, thunkAPI) => {
    try {
      await logoutApi();

      return null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || error.message);
      } else {
        return thunkAPI.rejectWithValue("An unexpected error occurred");
      }
    }
  },
);
