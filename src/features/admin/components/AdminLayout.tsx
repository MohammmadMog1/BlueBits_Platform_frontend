// src/features/admin/components/AdminLayout.tsx
import MainLayout from "../../../shared/layout/MainLayout/MainLayout";
import { adminNavItems } from "../admin.config";
import type { UserProfile } from "../../../shared/layout/MainLayout/MainLayout";
import { useAppSelector } from "../../../app/store/hooks";
import { getUserInitials } from "../../../shared/utils/user";
import {
  useGetYearsQuery,
  useGetSemestersQuery,
} from "../academic/api/academicApi";

export default function AdminLayout() {
  const userFromStore = useAppSelector((state) => state.auth.user);

  useGetYearsQuery();
  useGetSemestersQuery();

  // roleLabel لم يعد جزءاً من الـ profile – يُترجَم عند العرض من common:roles.*
  const userProfile: UserProfile = userFromStore
    ? {
        name: userFromStore.name,
        role: userFromStore.role,
        initials: getUserInitials(userFromStore.name),
        profile_image: userFromStore.profile_image,
      }
    : { name: "Guest", role: "GUEST", initials: "G" };

  return <MainLayout navItems={adminNavItems} userProfile={userProfile} />;
}
