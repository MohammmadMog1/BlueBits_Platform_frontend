// src/features/user/user.config.ts
import { LayoutDashboard, BookOpen, BrainCircuit, CheckSquare, MessageSquare, Calendar, Settings } from "lucide-react";
import type { NavItem } from "../../shared/layout/MainLayout/MainLayout";

export const userNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/user/dashboard" },
  { icon: BookOpen, label: "Lectures", path: "/user/lectures" },
  { icon: BrainCircuit, label: "MCQ Practice", path: "/user/mcq" },
  { icon: CheckSquare, label: "To-Do", path: "/user/todo" },
  { icon: MessageSquare, label: "AI Chatbot", path: "/user/chatbot" },
  { icon: Calendar, label: "Exam Schedule", path: "/user/exams" },
  { icon: Settings, label: "Settings", path: "/user/settings" },

];
