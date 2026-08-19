import {
  BarChart3,
  BookMarked,
  BrainCircuit,
  CalendarCheck,
  CalendarClock,
  ClipboardCheck,
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
  { icon: BrainCircuit, label: "Question Banks", path: "/admin/question-banks" },
  { icon: ClipboardList, label: "Academic Tasks", path: "/admin/academic-tasks" },
  { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
  {
    icon: ClipboardCheck,
    label: "Schedule Survey",
    path: "/admin/surveys",
  },
  {
    icon: BarChart3,
    label: "Survey Stats",
    path: "/admin/survey-stats",
  },
  {
    icon: CalendarClock,
    label: "Schedule Settings",
    path: "/admin/schedule-settings",
  },
  {
    icon: CalendarCheck,
    label: "Exam Schedule",
    path: "/admin/schedule-generate",
  },
  { icon: Sparkles, label: "AI Assistant", path: "/admin/assistant" },
];
