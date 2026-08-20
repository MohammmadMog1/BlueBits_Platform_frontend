import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";

type Props = {
  onNavigate?: (mode: "login" | "register" | "verify") => void;
};

/** مفاتيح رسائل التحقّق – نخزّن المفتاح لا النصّ حتى تتبدّل الرسالة مع اللغة */
type ValidationKey =
  | "validation.nameRequired"
  | "validation.emailRequired"
  | "validation.emailInvalid"
  | "validation.passwordRequired"
  | "validation.passwordMin"
  | "validation.confirmRequired"
  | "validation.passwordsMismatch";

type StrengthKey =
  | "strength.weak"
  | "strength.fair"
  | "strength.good"
  | "strength.strong";

export default function RegisterForm({ onNavigate }: Props) {
  const { t } = useTranslation("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, ValidationKey>>>(
    {},
  );

  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // تحسين دقة حساب القوة لتشمل الرموز الخاصة أيضاً
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++; // الحد الأدنى المسموح به
    if (pass.length >= 10) score++; // طول إضافي للأمان
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++; // أحرف كبيرة وصغيرة
    if (/[0-9]/.test(pass)) score++; // أرقام
    if (/[^A-Za-z0-9]/.test(pass)) score++; // رموز خاصة

    // لضمان ألا يتخطى الناتج 4 مستويات كحد أقصى للمربعات
    return Math.min(score, 4);
  };

  const strength = calculateStrength(password);

  // دالة موحدة لجلب الألوان بناءً على القوة (تستخدم للشريط والنص معاً)
  const getStrengthMeta = (): {
    color: string;
    textColor: string;
    labelKey: StrengthKey | null;
  } => {
    if (!password)
      return {
        color: "bg-slate-200",
        textColor: "text-slate-400",
        labelKey: null,
      };

    switch (strength) {
      case 1:
        return {
          color: "bg-rose-500",
          textColor: "text-rose-500",
          labelKey: "strength.weak",
        };
      case 2:
        return {
          color: "bg-amber-500",
          textColor: "text-amber-500",
          labelKey: "strength.fair",
        };
      case 3:
        return {
          color: "bg-indigo-500",
          textColor: "text-indigo-500",
          labelKey: "strength.good",
        };
      case 4:
        return {
          color: "bg-emerald-500",
          textColor: "text-emerald-500",
          labelKey: "strength.strong",
        };
      default:
        return {
          color: "bg-rose-500",
          textColor: "text-rose-500",
          labelKey: "strength.weak",
        };
    }
  };

  const {
    color: strengthColor,
    textColor: strengthTextColor,
    labelKey: strengthLabelKey,
  } = getStrengthMeta();

  const validate = () => {
    const e: Partial<Record<string, ValidationKey>> = {};
    if (!name) e.name = "validation.nameRequired";
    if (!email) e.email = "validation.emailRequired";
    else if (!/^\S+@\S+$/.test(email)) e.email = "validation.emailInvalid";
    if (!password) e.password = "validation.passwordRequired";
    else if (password.length < 6) e.password = "validation.passwordMin";
    if (!confirmPassword) e.confirmPassword = "validation.confirmRequired";
    else if (password !== confirmPassword)
      e.confirmPassword = "validation.passwordsMismatch";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;

    try {
      await register({ name, email, password });
      if (onNavigate) onNavigate("verify");
      else navigate("/verify");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const goToLogin = () => {
    if (onNavigate) onNavigate("login");
    else navigate("/auth/login");
  };

  return (
    <div className="w-full rounded-3xl border border-white/30 bg-white/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-[1.75rem] sm:p-10">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {t("register.title")}
        </h2>
        <p className="text-sm text-slate-600">{t("register.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Input */}
        <div>
          <div className="relative">
            <User
              className={`absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors sm:start-5 ${errors.name ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder={t("register.namePlaceholder")}
              className={`w-full border ${errors.name ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 ps-11 pe-4 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all sm:ps-14 sm:pe-5`}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-2 ms-3">{t(errors.name)}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <div className="relative">
            <Mail
              className={`absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors sm:start-5 ${errors.email ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              dir="ltr"
              placeholder={t("register.emailPlaceholder")}
              className={`w-full border ${errors.email ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 ps-11 pe-4 text-start text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all sm:ps-14 sm:pe-5`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 ms-3">{t(errors.email)}</p>
          )}
        </div>

        {/* Password Input & Strength Indicator */}
        <div>
          <div className="relative">
            <Lock
              className={`absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors sm:start-5 ${errors.password ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder={t("register.passwordPlaceholder")}
              className={`w-full border ${errors.password ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 ps-11 pe-11 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all sm:ps-14 sm:pe-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={t(showPassword ? "hidePassword" : "showPassword")}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 sm:end-5"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* التعديل المحسن لمؤشر قوة كلمة المرور */}
          <div className=" mt-3 flex items-center justify-between px-1">
            <div className="flex gap-1.5 flex-1 me-4">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1  rounded-full transition-all duration-300 ${
                    strength >= idx ? strengthColor : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-xs uppercase font-extrabold min-w-14 text-end transition-colors duration-300 ${strengthTextColor}`}
            >
              {strengthLabelKey ? t(strengthLabelKey) : ""}
            </span>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm mt-2 ms-3">
              {t(errors.password)}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <div className="relative">
            <Lock
              className={`absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors sm:start-5 ${errors.confirmPassword ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder={t("register.confirmPasswordPlaceholder")}
              className={`w-full border ${errors.confirmPassword ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 ps-11 pe-4 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all sm:ps-14 sm:pe-5`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-2 ms-3">
              {t(errors.confirmPassword)}
            </p>
          )}
        </div>

        {/* Server Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-base sm:text-lg rounded-2xl py-4 sm:py-5 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#404293]/25 mt-6 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isLoading ? t("register.submitting") : t("register.submit")}
        </button>
      </form>

      <div className="mt-6 sm:mt-8 text-center text-sm text-slate-400">
        {t("register.haveAccount")}{" "}
        <button
          onClick={goToLogin}
          className="font-bold text-[#404293] transition-colors hover:text-[#2f3378]"
        >
          {t("register.loginHere")}
        </button>
      </div>
    </div>
  );
}
