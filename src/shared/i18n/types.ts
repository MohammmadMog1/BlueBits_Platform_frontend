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
