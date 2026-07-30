// src/features/admin/components/AdminLayout.tsx
// import MainLayout, { UserProfile } from "../../../shared/layout/MainLayout/MainLayout";
import MainLayout from "../../../shared/layout/MainLayout/MainLayout";
import { adminNavItems, adminMoreNavItems } from "../admin.config";
import type { UserProfile } from "../../../shared/layout/MainLayout/MainLayout";
import { useAppSelector } from "../../../app/store/hooks";


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
    case "STUDENT":
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
const userProfile: UserProfile = userFromStore
    ? {
        name: userFromStore.name,
        roleLabel: getRoleLabel(userFromStore.role),
        initials: getUserInitials(userFromStore.name),
      }
    : { name: "Guest", roleLabel: "Guest", initials: "G" };
  return (
    <MainLayout 
      navItems={adminNavItems} 
      moreNavItems={adminMoreNavItems} 
      userProfile={userProfile} 
    />
  );
}