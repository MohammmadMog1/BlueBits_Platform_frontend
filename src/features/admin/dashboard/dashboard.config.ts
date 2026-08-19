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

/** اختصارات داشبورد الأدمن — نفس مسارات `adminNavItems` بلا تكرار للمنطق */
export const adminQuickActions: QuickAction[] = [
  {
    icon: Users,
    label: "المستخدمون",
    hint: "أدوار وصلاحيات",
    to: "/admin/users",
    tone: "brand",
  },
  {
    icon: FileText,
    label: "رفع محاضرة",
    hint: "إدارة المحاضرات",
    to: "/admin/lectures",
    tone: "violet",
  },
  {
    icon: BookMarked,
    label: "المواد",
    hint: "إضافة وتعديل",
    to: "/admin/subjects",
    tone: "sky",
  },
  {
    icon: ClipboardList,
    label: "مهمة أكاديمية",
    hint: "إنشاء ومتابعة",
    to: "/admin/academic-tasks",
    tone: "amber",
  },
  {
    icon: Megaphone,
    label: "إعلان جديد",
    hint: "تبليغ الطلاب",
    to: "/admin/announcements",
    tone: "rose",
  },
  {
    icon: BrainCircuit,
    label: "بنوك الأسئلة",
    hint: "رفع ومراجعة",
    to: "/admin/question-banks",
    tone: "emerald",
  },
  {
    icon: CalendarCheck,
    label: "توليد الجدول",
    hint: "جدول الامتحانات",
    to: "/admin/schedule-generate",
    tone: "brand",
  },
  {
    icon: Sparkles,
    label: "المساعد الذكي",
    hint: "اسأل عن بياناتك",
    to: "/admin/assistant",
    tone: "violet",
  },
];
