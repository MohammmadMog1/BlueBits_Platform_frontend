// src/features/profile/hooks/useProfile.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { getMeThunk } from "../../auth/redux/authThunk";
import type { User } from "../types/profile.types";

/**
 * يقرأ بيانات المستخدم من الـ store فقط (تُجلب مرة واحدة عند فتح الموقع في App.tsx).
 * refetch متاح فقط لإعادة الجلب اليدوية (مثلاً زر "Try Again").
 */
export function useProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user) as User | null;
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const isError = useAppSelector((state) => !!state.auth.error);

  const refetch = useCallback(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  return {
    user,
    isLoading: isLoading && !user,
    isError,
    refetch,
  };
}
