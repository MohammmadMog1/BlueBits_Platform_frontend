import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { logout as logoutAction } from "../redux/authSlice";
import {
  getMeThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from "../redux/authThunk";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );

  const login = useCallback(
    async (payload: LoginRequest) => {
      const result = await dispatch(loginThunk(payload));

      if (loginThunk.fulfilled.match(result)) {
        return result.payload;
      }

      throw result.payload ?? "Login failed";
    },
    [dispatch],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const result = await dispatch(registerThunk(payload));

      if (registerThunk.fulfilled.match(result)) {
        return result.payload;
      }

      throw result.payload ?? "Registration failed";
    },
    [dispatch],
  );

  const getMe = useCallback(async () => {
    const result = await dispatch(getMeThunk());

    if (getMeThunk.fulfilled.match(result)) {
      return result.payload;
    }

    throw result.payload ?? "Unable to load user";
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logoutAction());
    }
  }, [dispatch]);

  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      getMe,
      logout,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      getMe,
      logout,
    ],
  );
}

export default useAuth;
