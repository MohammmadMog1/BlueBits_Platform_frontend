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
import type auth from "./locales/ar/auth.json";
import type landing from "./locales/ar/landing.json";
import type dashboard from "./locales/ar/dashboard.json";
import type lectures from "./locales/ar/lectures.json";
import type admin from "./locales/ar/admin.json";
import type survey from "./locales/ar/survey.json";
import type mcq from "./locales/ar/mcq.json";
import type announcements from "./locales/ar/announcements.json";
import type tasks from "./locales/ar/tasks.json";
import type users from "./locales/ar/users.json";
import type ai from "./locales/ar/ai.json";
import type profile from "./locales/ar/profile.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      nav: typeof nav;
      auth: typeof auth;
      landing: typeof landing;
      dashboard: typeof dashboard;
      lectures: typeof lectures;
      admin: typeof admin;
      survey: typeof survey;
      mcq: typeof mcq;
      announcements: typeof announcements;
      tasks: typeof tasks;
      users: typeof users;
      ai: typeof ai;
      profile: typeof profile;
    };
    returnNull: false;
  }
}
