// src/shared/i18n/i18next.d.ts
/**
 * يربط أنواع i18next بملفات الترجمة الفعلية، فيصبح `t("nav:user.dashboard")`
 * مُدقَّقاً في وقت الترجمة: أي مفتاح مكتوب خطأً يصير خطأ TypeScript وليس
 * نصّاً خاماً يظهر للمستخدم.
 *
 * اللغة العربية هي المرجع لأنها اللغة الافتراضية والأكمل.
 */
import type common from "./locales/ar/common.json";
import type nav from "./locales/ar/nav.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      nav: typeof nav;
    };
    returnNull: false;
  }
}
