import { BookMarked, BrainCircuit, FileText } from "lucide-react";
import type { QuickAction } from "../../../shared/components/Dashboard/QuickActionsPanel";

/**
 * اختصارات داشبورد الدكتور — نفس مسارات `doctorNavItems` بلا تكرار للمنطق.
 * نخزّن مفاتيح الترجمة لا النصّ، لأن الثابت يُقيَّم مرّة واحدة عند تحميل الملف.
 */
export const doctorQuickActions: QuickAction[] = [
  {
    icon: BookMarked,
    labelKey: "doctor:quickActions.subjects.label",
    hintKey: "doctor:quickActions.subjects.hint",
    to: "/doctor/subjects",
    tone: "sky",
  },
  {
    icon: FileText,
    labelKey: "doctor:quickActions.uploadLecture.label",
    hintKey: "doctor:quickActions.uploadLecture.hint",
    to: "/doctor/lectures",
    tone: "violet",
  },
  {
    icon: BrainCircuit,
    labelKey: "doctor:quickActions.questionBanks.label",
    hintKey: "doctor:quickActions.questionBanks.hint",
    to: "/doctor/question-banks",
    tone: "emerald",
  },
];
