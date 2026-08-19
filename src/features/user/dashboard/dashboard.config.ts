import {
  BookOpen,
  BrainCircuit,
  CheckSquare,
  ClipboardCheck,
  Megaphone,
  Sparkles,
} from "lucide-react";
import type { QuickAction } from "../../../shared/components/Dashboard/QuickActionsPanel";

/** اختصارات داشبورد الطالب — نفس مسارات `userNavItems` */
export const userQuickActions: QuickAction[] = [
  {
    icon: BookOpen,
    label: "المحاضرات",
    hint: "تصفّح وحمّل",
    to: "/user/lectures",
    tone: "violet",
  },
  {
    icon: BrainCircuit,
    label: "تدرّب MCQ",
    hint: "بنوك الأسئلة",
    to: "/user/mcq",
    tone: "emerald",
  },
  {
    icon: CheckSquare,
    label: "مهامي",
    hint: "شخصية وأكاديمية",
    to: "/user/todo",
    tone: "amber",
  },
  {
    icon: ClipboardCheck,
    label: "الاستبيان",
    hint: "جدول الامتحانات",
    to: "/user/survey",
    tone: "brand",
  },
  {
    icon: Megaphone,
    label: "الإعلانات",
    hint: "أخبار دفعتك",
    to: "/user/announcements",
    tone: "sky",
  },
  {
    icon: Sparkles,
    label: "المساعد الذكي",
    hint: "اسأل واستذكر",
    to: "/user/assistant",
    tone: "rose",
  },
];
