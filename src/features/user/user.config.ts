// src/features/user/user.config.ts
import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  CheckSquare,
  ClipboardCheck,
  Megaphone,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../../shared/layout/MainLayout/MainLayout";

export const userNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/user/dashboard" },
  { icon: BookOpen, label: "Lectures", path: "/user/lectures" },
  { icon: BrainCircuit, label: "MCQ Practice", path: "/user/mcq" },
  { icon: ClipboardCheck, label: "Exam Survey", path: "/user/survey" },
  { icon: CheckSquare, label: "To-Do", path: "/user/todo" },
  { icon: Megaphone, label: "Announcements", path: "/user/announcements" },
  { icon: Sparkles, label: "AI Assistant", path: "/user/assistant" },
];
