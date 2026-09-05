// src/features/user/user.config.ts
import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  CheckSquare,
  ClipboardCheck,
  FolderOpen,
  Megaphone,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../../shared/layout/MainLayout/MainLayout";

/**
 * التسميات مفاتيح ترجمة لا نصوصاً – لأن هذا الثابت يُقيَّم مرّة واحدة عند
 * تحميل الوحدة، فلو خزّنّا نصّاً مترجَماً لتجمّد على لغة الإقلاع ولم يتغيّر
 * عند تبديل اللغة. الترجمة تحدث عند العرض داخل المكوّن.
 */
export const userNavItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "nav:user.dashboard", path: "/user/dashboard" },
  { icon: BookOpen, labelKey: "nav:user.lectures", path: "/user/lectures" },
  { icon: BrainCircuit, labelKey: "nav:user.mcq", path: "/user/mcq" },
  { icon: ClipboardCheck, labelKey: "nav:user.survey", path: "/user/survey" },
  { icon: CheckSquare, labelKey: "nav:user.todo", path: "/user/todo" },
  { icon: Megaphone, labelKey: "nav:user.announcements", path: "/user/announcements" },
  { icon: Sparkles, labelKey: "nav:user.assistant", path: "/user/assistant" },
];

/**
 * يظهر فقط لمن يملك إحدى صلاحيات بنك الأسئلة (permissions) — راجع UserLayout.
 * ليس ضمن userNavItems لأنه شرطي وليس ثابتاً لكل المستخدمين.
 */
export const userQuestionBankNavItem: NavItem = {
  icon: FolderOpen,
  labelKey: "nav:user.questionBanks",
  path: "/user/question-banks",
};
