// src/features/admin/components/AdminLayout.tsx
import MainLayout from "../../../shared/layout/MainLayout/MainLayout";
import { adminNavItems } from "../admin.config";
import type { UserProfile } from "../../../shared/layout/MainLayout/MainLayout";
import { useAppSelector } from "../../../app/store/hooks";
import {
  useGetYearsQuery,
  useGetSemestersQuery,
} from "../academic/api/academicApi";

function getUserInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRoleLabel(role: string) {
  switch (role) {
    case "USER":
      return "Student";
    case "LECTURER":
      return "Lecturer";
    case "BLUE":
      return "Blue";
    case "ADMIN":
      return "Admin";
    case "SUPER_ADMIN":
      return "Super Admin";
    default:
      return role;
  }
}

export default function AdminLayout() {
  const userFromStore = useAppSelector((state) => state.auth.user);

  useGetYearsQuery();
  useGetSemestersQuery();

  const userProfile: UserProfile = userFromStore
    ? {
        name: userFromStore.name,
        roleLabel: getRoleLabel(userFromStore.role),
        role: userFromStore.role, // ✨ أضفنا الدور الخام
        initials: getUserInitials(userFromStore.name),
        profile_image: userFromStore.profile_image,
      }
    : { name: "Guest", roleLabel: "Guest", role: "GUEST", initials: "G" };

  return <MainLayout navItems={adminNavItems} userProfile={userProfile} />;
}


