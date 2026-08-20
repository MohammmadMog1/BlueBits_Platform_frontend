// src/shared/i18n/types.ts
import type { ParseKeys } from "i18next";

/**
 * أنواع مفاتيح الترجمة، مشتقّة من ملفات JSON نفسها.
 *
 * فائدتها الحقيقية تظهر في المفاتيح المخزَّنة في بيانات (مثل `NavItem.labelKey`):
 * لولا هذه الأنواع لكان حقلاً من نوع `string`، فيمرّ أي مفتاح خاطئ بصمت حتى
 * يظهر للمستخدم نصّاً خاماً في الواجهة. الآن الخطأ يُلتقط في وقت الترجمة.
 */

/** مفتاح داخل namespace الافتراضي: "actions.save" */
export type CommonKey = ParseKeys<"common">;

/** مفتاح داخل namespace التنقّل، بصيغته المُسبَقة: "nav:user.dashboard" */
export type NavKey = `nav:${ParseKeys<"nav">}`;

/** مفتاح داخل namespace الداشبورد، بصيغته المُسبَقة: "dashboard:quickActions.mcq.label" */
export type DashboardKey = `dashboard:${ParseKeys<"dashboard">}`;

/** مفتاح داخل namespace لوحة التحكم: "schedule.timetable.viewGrid" */
export type AdminKey = ParseKeys<"admin">;

/**
 * أي مفتاح ترجمة كامل بصيغة "ns:key".
 *
 * يُستخدم في البيانات التي تُعرَّف على مستوى الوحدة (قوائم الاختصارات مثلاً)
 * حيث نخزّن المفتاح بدل النصّ. النوع يجعل أي مفتاح مكتوب خطأً خطأً في وقت
 * الترجمة بدل أن يظهر خاماً للمستخدم.
 */
export type TranslationKey = ParseKeys<AllNamespaces>;

/**
 * قائمة الـ namespaces كـ tuple لا كاتّحاد — الفرق مقصود: أنواع i18next
 * تُولّد المفاتيح المُسبَقة ("ns:key") من الـ tuple فقط، بينما الاتّحاد يدمج
 * المفاتيح بلا بادئة فيسقط التمييز بين الـ namespaces.
 */
export type AllNamespaces = [
  "common",
  "nav",
  "auth",
  "landing",
  "dashboard",
  "lectures",
  "admin",
  "survey",
  "mcq",
  "announcements",
  "tasks",
  "users",
  "ai",
  "profile",
];
