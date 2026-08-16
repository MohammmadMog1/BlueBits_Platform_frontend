// src/shared/layout/MainLayout/MainLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import BottomBar from "../../components/BottomBar/BottomBar";
import ProfileDrawer from "../../../features/profile/components/ProfileDrawer";

export interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

export interface UserProfile {
  name: string;
  roleLabel: string; // للعرض فقط (Student, Admin, etc.)
  role: string;      // ✨ جديد: الدور الخام للمقارنة (USER, ADMIN, SUPER_ADMIN)
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <BottomBar navItems={navItems} userProfile={userProfile} />
      </div>

      <ProfileDrawer open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default MainLayout;