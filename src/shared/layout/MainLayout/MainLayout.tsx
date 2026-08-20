// src/shared/layout/MainLayout/MainLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import type { NavKey } from "../../i18n/types";
import Header from "../../components/Header/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import BottomBar from "../../components/BottomBar/BottomBar";
import ProfileDrawer from "../../../features/profile/components/ProfileDrawer";

export interface NavItem {
  icon: React.ElementType;
  /** مفتاح ترجمة داخل namespace الـ `nav` – يُترجَم عند العرض لا عند التعريف */
  labelKey: NavKey;
  path: string;
}

export interface UserProfile {
  name: string;
  role: string;      // الدور الخام للمقارنة (USER, ADMIN, SUPER_ADMIN)
  initials: string;
  profile_image?: string;
}

interface MainLayoutProps {
  navItems: NavItem[];
  userProfile: UserProfile;
}

const MainLayout = ({ navItems, userProfile }: MainLayoutProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-gray-50">
      {/* ✅ تم تمرير userProfile الذي يحتوي الآن على role */}
      <Sidebar
        navItems={navItems}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        isProfileOpen={isProfileOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          userProfile={userProfile}
          onOpenProfile={() => setIsProfileOpen(true)}
          isProfileOpen={isProfileOpen}
        />
        <main className="flex-1 overflow-y-auto overscroll-contain p-3 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] sm:p-6 lg:pb-6">
          <Outlet />
        </main>
        <BottomBar navItems={navItems} userProfile={userProfile} />
      </div>

      <ProfileDrawer open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default MainLayout;