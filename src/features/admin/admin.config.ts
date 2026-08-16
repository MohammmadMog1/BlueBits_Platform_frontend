import {
  BookMarked,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Users,
  FileText,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../../shared/layout/MainLayout/MainLayout";

export const adminNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Admin Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Manage Users", path: "/admin/users" },
  { icon: GraduationCap, label: "Academic Structure", path: "/admin/academic" },
  { icon: BookMarked, label: "Manage Subjects", path: "/admin/subjects" },
  { icon: FileText, label: "Manage Lectures", path: "/admin/lectures" },
  { icon: FileText, label: "Content", path: "/admin/content" },
  { icon: Shield, label: "Roles & Permissions", path: "/admin/roles" },
  { icon: Settings, label: "System Settings", path: "/admin/settings" }
];

export const adminMoreNavItems: NavItem[] = [
  { icon: Shield, label: "Roles & Permissions", path: "/admin/roles" },
  { icon: Settings, label: "System Settings", path: "/admin/settings" },
];
