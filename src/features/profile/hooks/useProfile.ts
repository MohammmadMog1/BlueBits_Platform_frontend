// src/features/profile/hooks/useProfile.ts
import { useAppSelector } from "../../../app/store/hooks";
import { useGetMeQuery } from "../api/profileApi";
import type { User } from "../types/profile.types";

/**
 * يدمج بيانات الـ store (السريعة) مع بيانات الـ API (الطازجة).
 * نعرض الـ store فوراً، ولما يوصل الرد من الـ API نحدّث تلقائياً.
 */
export function useProfile() {
  const storeUser = useAppSelector((state) => state.auth.user) as User | null;

  const { data: apiUser, isLoading, isError, refetch } = useGetMeQuery(
    undefined,
    { skip: !storeUser }
  );

  return {
    user: apiUser ?? storeUser,
    isLoading,
    isError,
    refetch,
  };
}