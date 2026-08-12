// src/shared/layout/MainLayout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import BottomBar from "../../components/BottomBar/BottomBar";
// import { ReactNode } from "react";

// 1. تعريف أنواع البيانات المشتركة
export interface NavItem {
  icon: React.ElementType; // نوع أيقونات Lucide
  label: string;
  path: string;
}

export interface UserProfile {
  name: string;
  roleLabel: string; // e.g., "Student" or "Administrator"
  initials: string;  // e.g., "AH"
}

interface MainLayoutProps {
  navItems: NavItem[];       // للعناصر الرئيسية في Sidebar و BottomBar
  moreNavItems?: NavItem[];  // للعناصر الإضافية في قائمة "المزيد"
  userProfile: UserProfile;  // بيانات المستخدم الديناميكية
}

const MainLayout = ({ navItems,  userProfile }: MainLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* تمرير البيانات للـ Sidebar */}
      <Sidebar navItems={navItems} userProfile={userProfile} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <Header /> */}
        <Header userProfile={userProfile} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet /> {/* هنا يتم حقن صفحات Admin أو User */}
        </main>
        
        {/* تمرير البيانات للـ BottomBar */}
        <BottomBar navItems={navItems}
        //  moreNavItems={moreNavItems} 
         />
      </div>
    </div>
  );
};

export default MainLayout;