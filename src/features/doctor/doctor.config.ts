import { BookMarked, BrainCircuit, FileText, LayoutDashboard } from "lucide-react";
import type { NavItem } from "../../shared/layout/MainLayout/MainLayout";

/** انظر التعليق في user.config.ts بخصوص استخدام المفاتيح بدل النصوص. */
export const doctorNavItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "nav:doctor.dashboard", path: "/doctor/dashboard" },
  { icon: BookMarked, labelKey: "nav:doctor.subjects", path: "/doctor/subjects" },
  { icon: FileText, labelKey: "nav:doctor.lectures", path: "/doctor/lectures" },
  { icon: BrainCircuit, labelKey: "nav:doctor.questionBanks", path: "/doctor/question-banks" },
];
