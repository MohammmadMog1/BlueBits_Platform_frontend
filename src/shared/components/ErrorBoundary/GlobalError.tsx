import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CommonKey } from "../../i18n/types";

interface GlobalErrorProps {
  /** نصّ جاهز – يُستخدم فقط لرسائل ديناميكية من الخادم */
  title?: string;
  message?: string;
  /** مفاتيح ترجمة – الطريقة المفضّلة، لأن الرسالة تتبع لغة المستخدم */
  titleKey?: CommonKey;
  messageKey?: CommonKey;
  onRetry?: () => void;
}

export default function GlobalError({
  title,
  message,
  titleKey = "errors.title",
  messageKey = "errors.generic",
  onRetry,
}: GlobalErrorProps) {
  const { t } = useTranslation();

  // النصّ الصريح يتقدّم على المفتاح عند وجوده
  const resolvedTitle = title ?? t(titleKey);
  const resolvedMessage = message ?? t(messageKey);

  return (
    // الخلفية الكلية متناسقة مع بيئة التطبيق الفاتحة والانسيابية
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-10 sm:px-6">
      
      {/* الكارد يعتمد نفس تصميم الـ Glassmorphism الفاتح والـ Borders الناعمة مثل فورم التسجيل */}
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/30 bg-white/95 p-8 text-center shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-10">
        
        {/* أيقونة التنبيه مع تأثير الدائرة المحيطة المتناسقة مع اللون الأحمر للخطأ */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 border border-rose-100/80 shadow-inner">
          <AlertCircle className="h-8 w-8" />
        </div>
        
        {/* النصوص ملوّنة لتناسب الخلفية البيضاء الجذابة */}
        <h2 className="mb-2 text-2xl font-bold text-slate-950">
          {resolvedTitle}
        </h2>

        <p className="mb-8 text-sm leading-relaxed text-slate-500 px-2">
          {resolvedMessage}
        </p>
        
        {onRetry ? (
          /* زر إعادة المحاولة بنفس كود الألوان المتدرجة، الأبعاد، وتأثير الـ Shadow والـ Scale عند التحويم */
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-base rounded-2xl py-4 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#404293]/25"
          >
            {t("actions.retry")}
          </button>
        ) : null}
        
      </div>
    </div>
  );
}