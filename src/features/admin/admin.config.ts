import {
  BarChart3,
  BookMarked,
  BrainCircuit,
  CalendarCheck,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Megaphone,
  Users,
  FileText,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../../shared/layout/MainLayout/MainLayout";

/** انظر التعليق في user.config.ts بخصوص استخدام المفاتيح بدل النصوص. */
export const adminNavItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "nav:admin.dashboard", path: "/admin/dashboard" },
  { icon: Users, labelKey: "nav:admin.users", path: "/admin/users" },
  { icon: GraduationCap, labelKey: "nav:admin.academic", path: "/admin/academic" },
  { icon: BookMarked, labelKey: "nav:admin.subjects", path: "/admin/subjects" },
  { icon: FileText, labelKey: "nav:admin.lectures", path: "/admin/lectures" },
  { icon: BrainCircuit, labelKey: "nav:admin.questionBanks", path: "/admin/question-banks" },
  { icon: ClipboardList, labelKey: "nav:admin.academicTasks", path: "/admin/academic-tasks" },
  { icon: Megaphone, labelKey: "nav:admin.announcements", path: "/admin/announcements" },
  { icon: ClipboardCheck, labelKey: "nav:admin.surveys", path: "/admin/surveys" },
  { icon: BarChart3, labelKey: "nav:admin.surveyStats", path: "/admin/survey-stats" },
  {
    icon: CalendarClock,
    labelKey: "nav:admin.scheduleSettings",
    path: "/admin/schedule-settings",
  },
  {
    icon: Layers,
    labelKey: "nav:admin.scheduleGroups",
    path: "/admin/schedule-groups",
  },
  {
    icon: CalendarCheck,
    labelKey: "nav:admin.scheduleGenerate",
    path: "/admin/schedule-generate",
  },
  { icon: Sparkles, labelKey: "nav:admin.assistant", path: "/admin/assistant" },
];
