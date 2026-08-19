import { useMemo } from "react";
import { useAppSelector } from "../../../../app/store/hooks";
import type { Permission } from "../../../auth/types/auth.types";

export interface QuestionBankPermissions {
  canCreate: boolean;
  canUpdateQuestion: boolean;
  canDeleteQuestion: boolean;
}

/**
 * صلاحيات بنك الأسئلة: الأدمن والسوبر أدمن يملكون كل الصلاحيات،
 * وباقي الأدوار تُمنح بشكل صريح عبر user.permissions.
 */
export function useQuestionBankPermissions(): QuestionBankPermissions {
  const user = useAppSelector((state) => state.auth.user);

  return useMemo(() => {
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    const granted = user?.permissions ?? [];
    const has = (permission: Permission) =>
      isAdmin || granted.includes(permission);

    return {
      canCreate: has("CREATE_QUESTION_BANK"),
      canUpdateQuestion: has("UPDATE_QUESTION"),
      canDeleteQuestion: has("DELETE_QUESTION"),
    };
  }, [user]);
}
