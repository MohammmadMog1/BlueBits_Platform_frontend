import {
  BookMarked,
  GraduationCap,
  LayoutDashboard,
  Users,
  FileText,
} from "lucide-react";
import type { NavItem } from "../../shared/layout/MainLayout/MainLayout";

export const adminNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Admin Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Manage Users", path: "/admin/users" },
  { icon: GraduationCap, label: "Academic Structure", path: "/admin/academic" },
  { icon: BookMarked, label: "Manage Subjects", path: "/admin/subjects" },
  { icon: FileText, label: "Manage Lectures", path: "/admin/lectures" },
];
