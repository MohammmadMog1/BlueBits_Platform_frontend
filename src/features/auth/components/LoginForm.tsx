import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useLanguage } from "../../../shared/i18n/useLanguage";
import useAuth from "../hooks/useAuth";

type Props = {
  onNavigate?: (mode: "login" | "register" | "verify") => void;
};

/** مفاتيح رسائل التحقّق – نخزّن المفتاح لا النصّ حتى تتبدّل الرسالة مع اللغة */
type ValidationKey =
  | "validation.emailRequired"
  | "validation.emailInvalid"
  | "validation.passwordRequired";

export default function LoginForm({ onNavigate }: Props) {
  const { t } = useTranslation("auth");
  const { isRTL } = useLanguage();
  const { login, isLoading, error } = useAuth();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: ValidationKey;
    password?: ValidationKey;
  }>({});
  const navigate = useNavigate();

  const validate = () => {
    const e: { email?: ValidationKey; password?: ValidationKey } = {};
    if (!email) e.email = "validation.emailRequired";
    else if (!/^\S+@\S+$/i.test(email)) e.email = "validation.emailInvalid";
    if (!password) e.password = "validation.passwordRequired";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;

    try {
      const { user } = await login({ email, password });

      const isAdminRole = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
      const defaultPath = isAdminRole ? "/admin" : "/user";

      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      navigate(from && from !== "/auth/login" ? from : defaultPath);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const goToRegister = () => {
    if (onNavigate) onNavigate("register");
    else navigate("/auth/register");
  };

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  return (
    <div className="w-full rounded-3xl border border-white/30 bg-white/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-[1.75rem] sm:p-10">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {t("login.title")}
        </h2>
        <p className="text-sm text-slate-600">{t("login.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
              placeholder={t("login.emailPlaceholder")}
              className={`w-full border ${errors.email ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 ps-11 pe-4 text-start text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all sm:ps-14 sm:pe-5`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 ms-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {t(errors.email)}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock
              className={`absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors sm:start-5 ${errors.password ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwordPlaceholder")}
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
          {errors.password && (
            <p className="text-red-500 text-sm mt-2 ms-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {t(errors.password)}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-medium text-[#404293] transition-colors hover:text-[#2f3378] hover:underline"
          >
            {t("login.forgotPassword")}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-base sm:text-lg rounded-2xl py-4 sm:py-5 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#404293]/25 disabled:opacity-70 disabled:hover:scale-100 mt-2"
        >
          {isLoading ? t("login.submitting") : t("login.submit")}
          {!isLoading && (
            <ArrowRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
          )}
        </button>
      </form>

      <div className="mt-6 sm:mt-8 text-center text-sm text-slate-600">
        {t("login.noAccount")}{" "}
        <button
          onClick={goToRegister}
          className="font-bold text-[#404293] transition-colors hover:text-[#2f3378]"
        >
          {t("login.registerHere")}
        </button>
      </div>
    </div>
  );
}
