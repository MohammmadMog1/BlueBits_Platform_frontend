import {
  BookMarked,
  BrainCircuit,
  CalendarCheck,
  ClipboardList,
  FileText,
  Megaphone,
  Sparkles,
  Users,
} from "lucide-react";
import type { QuickAction } from "../../../shared/components/Dashboard/QuickActionsPanel";

/**
 * اختصارات داشبورد الأدمن — نفس مسارات `adminNavItems` بلا تكرار للمنطق.
 * نخزّن مفاتيح الترجمة لا النصّ، لأن الثابت يُقيَّم مرّة واحدة عند تحميل الملف.
 */
export const adminQuickActions: QuickAction[] = [
  {
    icon: Users,
    labelKey: "admin:quickActions.users.label",
    hintKey: "admin:quickActions.users.hint",
    to: "/admin/users",
    tone: "brand",
  },
  {
    icon: FileText,
    labelKey: "admin:quickActions.uploadLecture.label",
    hintKey: "admin:quickActions.uploadLecture.hint",
    to: "/admin/lectures",
    tone: "violet",
  },
  {
    icon: BookMarked,
    labelKey: "admin:quickActions.subjects.label",
    hintKey: "admin:quickActions.subjects.hint",
    to: "/admin/subjects",
    tone: "sky",
  },
  {
    icon: ClipboardList,
    labelKey: "admin:quickActions.academicTask.label",
    hintKey: "admin:quickActions.academicTask.hint",
    to: "/admin/academic-tasks",
    tone: "amber",
  },
  {
    icon: Megaphone,
    labelKey: "admin:quickActions.announcement.label",
    hintKey: "admin:quickActions.announcement.hint",
    to: "/admin/announcements",
    tone: "rose",
  },
  {
    icon: BrainCircuit,
    labelKey: "admin:quickActions.questionBanks.label",
    hintKey: "admin:quickActions.questionBanks.hint",
    to: "/admin/question-banks",
    tone: "emerald",
  },
  {
    icon: CalendarCheck,
    labelKey: "admin:quickActions.generateSchedule.label",
    hintKey: "admin:quickActions.generateSchedule.hint",
    to: "/admin/schedule-generate",
    tone: "brand",
  },
  {
    icon: Sparkles,
    labelKey: "admin:quickActions.assistant.label",
    hintKey: "admin:quickActions.assistant.hint",
    to: "/admin/assistant",
    tone: "violet",
  },
];
