import {
  BookOpen,
  BrainCircuit,
  CheckSquare,
  ClipboardCheck,
  Megaphone,
  Sparkles,
} from "lucide-react";
import type { QuickAction } from "../../../shared/components/Dashboard/QuickActionsPanel";

/**
 * اختصارات داشبورد الطالب — نفس مسارات `userNavItems`.
 * نخزّن مفاتيح الترجمة لا النصّ، لأن الثابت يُقيَّم مرّة واحدة عند تحميل الملف.
 */
export const userQuickActions: QuickAction[] = [
  {
    icon: BookOpen,
    labelKey: "dashboard:quickActions.lectures.label",
    hintKey: "dashboard:quickActions.lectures.hint",
    to: "/user/lectures",
    tone: "violet",
  },
  {
    icon: BrainCircuit,
    labelKey: "dashboard:quickActions.mcq.label",
    hintKey: "dashboard:quickActions.mcq.hint",
    to: "/user/mcq",
    tone: "emerald",
  },
  {
    icon: CheckSquare,
    labelKey: "dashboard:quickActions.tasks.label",
    hintKey: "dashboard:quickActions.tasks.hint",
    to: "/user/todo",
    tone: "amber",
  },
  {
    icon: ClipboardCheck,
    labelKey: "dashboard:quickActions.survey.label",
    hintKey: "dashboard:quickActions.survey.hint",
    to: "/user/survey",
    tone: "brand",
  },
  {
    icon: Megaphone,
    labelKey: "dashboard:quickActions.announcements.label",
    hintKey: "dashboard:quickActions.announcements.hint",
    to: "/user/announcements",
    tone: "sky",
  },
  {
    icon: Sparkles,
    labelKey: "dashboard:quickActions.assistant.label",
    hintKey: "dashboard:quickActions.assistant.hint",
    to: "/user/assistant",
    tone: "rose",
  },
];
