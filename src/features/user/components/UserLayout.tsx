// src/features/user/components/UserLayout.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { UserProfile } from "../../../shared/layout/MainLayout/MainLayout";
import MainLayout from "../../../shared/layout/MainLayout/MainLayout";
import { useAppSelector } from "../../../app/store/hooks";
import { getUserInitials } from "../../../shared/utils/user";
import { useQuestionBankPermissions } from "../../admin/questionBanks";
import { userNavItems, userQuestionBankNavItem } from "../user.config";

export default function UserLayout() {
  const { t } = useTranslation("common");
  const userFromStore = useAppSelector((state) => state.auth.user);

  const bankPermissions = useQuestionBankPermissions();
  const hasBankAccess =
    bankPermissions.canCreate || bankPermissions.canUpdateQuestion || bankPermissions.canDeleteQuestion;

  // رابط "بنك الأسئلة" يظهر فقط لمن يملك إحدى صلاحياته الإضافية (permissions)،
  // بغضّ النظر عن الدور (BLUE أو USER عادي).
  const navItems = useMemo(
    () => (hasBankAccess ? [...userNavItems, userQuestionBankNavItem] : userNavItems),
    [hasBankAccess],
  );

  // roleLabel لم يعد جزءاً من الـ profile – يُترجَم عند العرض من common:roles.*
  const userProfile: UserProfile = userFromStore
    ? {
        name: userFromStore.name,
        role: userFromStore.role,
        initials: getUserInitials(userFromStore.name),
        profile_image: userFromStore.profile_image,
      }
    : { name: t("roles.GUEST"), role: "GUEST", initials: "G" };

  return <MainLayout navItems={navItems} userProfile={userProfile} />;
}
