import { useEffect, useState } from "react";
import { Mail, RefreshCcw, ChevronLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/i18n/useLanguage";
import apiClient from "../../../shared/api/apiClient"; // استيراد الـ Client الخاص بك لطلبات الـ API المباشرة

type Props = {
  onNavigate?: (mode: "login" | "register" | "verify") => void;
};

export default function VerifyEmail({ onNavigate }: Props) {
  const { t } = useTranslation("auth");
  const { isRTL } = useLanguage();
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setIsResending(true);
    setResendError(null);
    try {
      // استدعاء رابط إعادة إرسال كود التحقق من السيرفر مباشرة
      // عدل المسار ("/auth/resend-verify") حسب روابط الـ API لديك
      await apiClient.post("/auth/resend-verify");

      setCountdown(30); // إعادة تعيين العداد التنازلي بعد النجاح
    } catch (err: any) {
      setResendError(err.response?.data?.message || t("verify.resendFailed"));
    } finally {
      setIsResending(false);
    }
  };

  const goToLogin = () => {
    if (onNavigate) onNavigate("login");
    else navigate("/auth/login");
  };

  return (
    <div className="bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-2xl rounded-[2rem] p-10 sm:p-14 w-full text-center">
      <div className="mx-auto w-28 h-28 bg-gradient-to-br from-[#404293]/20 to-[#2376BB]/20 rounded-full flex items-center justify-center mb-10 border border-gray-200 shadow-lg shadow-[#404293]/10 relative">
        <div
          className="absolute inset-0 rounded-full animate-ping border border-[#404293]/30 opacity-50"
          style={{ animationDuration: "3s" }}
        />
        <Mail className="w-12 h-12 text-[#404293]" />
      </div>

      <h2 className="text-3xl font-bold text-[#202121] mb-5">
        {t("verify.title")}
      </h2>

      <p className="text-gray-600 mb-12 leading-relaxed text-base">
        {t("verify.descriptionLine1")}
        <br className="hidden sm:block" />
        {t("verify.descriptionLine2")}
      </p>

      {/* عرض الخطأ في حال فشل إعادة الإرسال */}
      {resendError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm mb-5 text-start">
          <AlertCircle className="w-4 h-4 shrink-0" /> {resendError}
        </div>
      )}

      <div className="space-y-5">
        <button
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className="w-full bg-gray-100 border border-gray-200 text-[#202121] font-bold text-lg rounded-2xl py-5 flex items-center justify-center gap-2 hover:bg-gray-200 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md"
        >
          {isResending ? (
            <RefreshCcw className="w-5 h-5 animate-spin" />
          ) : (
            <Mail className="w-5 h-5" />
          )}
          {countdown > 0
            ? t("verify.resendIn", { seconds: countdown })
            : t("verify.resend")}
        </button>

        <button
          onClick={goToLogin}
          className="w-full text-gray-600 font-medium py-4 flex items-center justify-center gap-2 hover:text-[#202121] transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          {t("backToLogin")}
        </button>
      </div>
    </div>
  );
}
