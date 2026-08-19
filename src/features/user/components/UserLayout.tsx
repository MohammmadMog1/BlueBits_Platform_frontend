// src/features/user/components/UserLayout.tsx
import type { UserProfile } from "../../../shared/layout/MainLayout/MainLayout";
import MainLayout from "../../../shared/layout/MainLayout/MainLayout";
import { useAppSelector } from "../../../app/store/hooks";
import { getUserInitials } from "../../../shared/utils/user";
import { userNavItems } from "../user.config";

export default function UserLayout() {
  const userFromStore = useAppSelector((state) => state.auth.user);

  // roleLabel لم يعد جزءاً من الـ profile – يُترجَم عند العرض من common:roles.*
  const userProfile: UserProfile = userFromStore
    ? {
        name: userFromStore.name,
        role: userFromStore.role,
        initials: getUserInitials(userFromStore.name),
        profile_image: userFromStore.profile_image,
      }
    : { name: "Guest", role: "GUEST", initials: "G" };

  return <MainLayout navItems={userNavItems} userProfile={userProfile} />;
}
