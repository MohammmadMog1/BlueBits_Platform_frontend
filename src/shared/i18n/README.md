# نظام اللغات والاتجاه — BlueBits

العربية هي اللغة الافتراضية. الإنكليزية تُفعَّل باختيار صريح من المستخدم.

## البنية

```
src/shared/i18n/
├── config.ts          اللغات المدعومة، الاتجاه، نظام الأرقام  ← ابدأ من هنا
├── index.ts           تهيئة i18next + مزامنة سمات <html>
├── resources.ts       تجميع تلقائي لملفات JSON + فحص المفاتيح الناقصة
├── types.ts           أنواع مفاتيح الترجمة (CommonKey / NavKey)
├── i18next.d.ts       ربط الأنواع بملفات JSON
├── useLanguage.ts     اللغة الحالية، الاتجاه، التبديل
├── useFormatters.ts   تنسيق التواريخ والأرقام حسب اللغة
└── locales/
    ├── ar/{common,nav}.json
    └── en/{common,nav}.json
```

## القواعد الثابتة

### ١. الاتجاه يُضبط على `<html>` فقط

لا تكتب `dir="rtl"` داخل أي مكوّن — هذا يجمّد الاتجاه ويعطّل التبديل.
الاستثناء الوحيد المشروع: `dir="ltr"` على عنصر يحتوي محتوى لاتينياً إجبارياً
(بريد إلكتروني، رابط، كود، رقم هاتف، اسم علامة تجارية).

### ٢. استخدم الخصائص المنطقية بدل الفيزيائية

هذه هي النقطة التي تُفشل معظم مشاريع RTL. الخصائص الفيزيائية لا تنقلب:

| ❌ فيزيائي (لا ينقلب) | ✅ منطقي (ينقلب تلقائياً) |
| --------------------- | ------------------------- |
| `pl-4` / `pr-4`       | `ps-4` / `pe-4`           |
| `ml-3` / `mr-3`       | `ms-3` / `me-3`           |
| `left-0` / `right-0`  | `start-0` / `end-0`       |
| `text-left`           | `text-start`              |
| `text-right`          | `text-end`                |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-*`         | `rounded-s-*`             |

**متى يبقى الفيزيائي صحيحاً؟** عند التوسيط أو التماثل الحقيقي، مثل
`left-1/2 -translate-x-1/2` لمؤشّر مركزي — هذا لا علاقة له بالاتجاه.

**الأيقونات الاتجاهية** (`ChevronRight`، `ArrowLeft`) تحتاج قلباً يدوياً:

```tsx
const { isRTL } = useLanguage();
<ChevronRight className={isRTL ? "rotate-180" : ""} />
```

### ٣. لا تخزّن نصّاً مترجَماً في ثابت على مستوى الوحدة

الثوابت تُقيَّم مرّة واحدة عند تحميل الملف، فيتجمّد النصّ على لغة الإقلاع
ولا يتغيّر عند التبديل. خزّن **المفتاح** وترجم عند العرض:

```ts
// ❌ يتجمّد على لغة الإقلاع
export const items = [{ label: t("nav:user.mcq"), path: "/user/mcq" }];

// ✅
export const items = [{ labelKey: "nav:user.mcq", path: "/user/mcq" }];
// وفي المكوّن: t(item.labelKey)
```

## ترحيل صفحة إلى نظام الترجمة

**١. أنشئ ملفّي namespace** باسم الميزة — لا تكديس كل شيء في `common`:

```
src/shared/i18n/locales/ar/lectures.json
src/shared/i18n/locales/en/lectures.json
```

الملف يُلتقط تلقائياً عبر `import.meta.glob` — لا يوجد ملف إعداد تُسجّل فيه.

**٢. أضف الـ namespace إلى `i18next.d.ts`** ليعمل التدقيق النوعي:

```ts
import type lectures from "./locales/ar/lectures.json";
// ثم داخل resources:  lectures: typeof lectures;
```

**٣. في المكوّن:**

```tsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation("lectures");        // namespace واحد
const { t } = useTranslation(["lectures", "common"]); // عدّة – الأوّل افتراضي

<h1>{t("title")}</h1>
<button>{t("common:actions.save")}</button>
```

**٤. استبدل التنسيق اليدوي** بـ `useFormatters`:

```tsx
const { formatFullDate, formatNumber, formatRelative } = useFormatters();
formatRelative(task.createdAt);   // "منذ 3 أيام" / "3 days ago"
```

## الجمع في العربية

العربية لها ٦ صيغ جمع. i18next يتكفّل بها عبر لواحق المفاتيح:

```json
{
  "count_zero": "لا توجد مهام",
  "count_one":  "مهمة واحدة",
  "count_two":  "مهمتان",
  "count_few":  "{{count}} مهام",
  "count_many": "{{count}} مهمة",
  "count_other":"{{count}} مهمة"
}
```

```tsx
t("count", { count: tasks.length });
```

الإنكليزية تحتاج `_one` و `_other` فقط.

## أدوات مساعدة

- **فحص المفاتيح الناقصة**: يعمل تلقائياً في وضع التطوير ويطبع تحذيراً في
  الـ console لأي مفتاح موجود في `ar` وناقص في `en` (والعكس).
- **اختبار لغة بسرعة**: أضف `?lang=en` إلى الرابط.
- **تغيير نظام الأرقام العربية**: ثابت `ARABIC_NUMERALS` في `config.ts`
  (`latn` = 0-9، `arab` = ٠-٩).
- **إضافة لغة جديدة**: أضفها إلى `SUPPORTED_LANGUAGES` و `LANGUAGES` في
  `config.ts`، وأنشئ مجلد `locales/<code>/`، وحدّث قائمة `SUPPORTED` في سكربت
  الإقلاع داخل `index.html`.

## الخط

`Boutros MBC Dinkum` في `public/fonts/`، مُعرَّف في `src/styles/index.css`.
يُطبَّق على المحارف العربية فقط عبر `unicode-range`، بينما يرسم
`Plus Jakarta Sans` الأحرف اللاتينية والأرقام.

**متوفّر بوزن Medium (500) واحد فقط.** الأوزان الأثقل يولّدها المتصفّح صناعياً،
ولذلك يبدو `font-bold` و `font-black` متطابقين. عند الحصول على أوزان حقيقية:
أضف كتلة `@font-face` لكل وزن بنفس `unicode-range`، واحذف قاعدة
`font-synthesis-weight` من `index.css`.
