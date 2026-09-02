// src/features/doctor/components/DoctorLayout.tsx
import { useTranslation } from "react-i18next";
import MainLayout from "../../../shared/layout/MainLayout/MainLayout";
import { doctorNavItems } from "../doctor.config";
import type { UserProfile } from "../../../shared/layout/MainLayout/MainLayout";
import { useAppSelector } from "../../../app/store/hooks";
import { getUserInitials } from "../../../shared/utils/user";

export default function DoctorLayout() {
  const { t } = useTranslation("common");
  const userFromStore = useAppSelector((state) => state.auth.user);

  const userProfile: UserProfile = userFromStore
    ? {
        name: userFromStore.name,
        role: userFromStore.role,
        initials: getUserInitials(userFromStore.name),
        profile_image: userFromStore.profile_image,
      }
    : { name: t("roles.GUEST"), role: "GUEST", initials: "G" };

  return <MainLayout navItems={doctorNavItems} userProfile={userProfile} />;
}
