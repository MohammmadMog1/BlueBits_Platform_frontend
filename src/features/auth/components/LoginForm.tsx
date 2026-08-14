import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";

type Props = {
  onNavigate?: (mode: "login" | "register" | "verify") => void;
};

export default function LoginForm({ onNavigate }: Props) {
  const { login, isLoading, error } = useAuth();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const navigate = useNavigate();

  // حذفنا المتغيرات المحلية (isSubmitting و loginError) لأننا سنستخدم isLoading و error من Redux

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email) e.email = "Email is required";
    else if (!/^\S+@\S+$/i.test(email)) e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
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
        <h2 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">Welcome Back</h2>
        <p className="text-sm text-slate-600">
          Login to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div>
          <div className="relative">
            <Mail
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors sm:left-5 ${errors.email ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              className={`w-full border ${errors.email ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all sm:pl-14 sm:pr-5`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 ml-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors sm:left-5 ${errors.password ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full border ${errors.password ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 pl-11 pr-11 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all sm:pl-14 sm:pr-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 sm:right-5"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-2 ml-3 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <a
            href="#"
            onClick={handleForgotPassword} 
            className="text-sm font-medium text-[#404293] transition-colors hover:text-[#2f3378] hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        {/* 5. عرض رسالة الخطأ القادمة من Redux */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* 6. استخدام isLoading من Redux لتعطيل الزر وإظهار حالة التحميل */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-base sm:text-lg rounded-2xl py-4 sm:py-5 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#404293]/25 disabled:opacity-70 disabled:hover:scale-100 mt-2"
        >
          {isLoading ? "Logging in..." : "Login"}
          {!isLoading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>

      <div className="mt-6 sm:mt-8 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <button
          onClick={goToRegister}
          className="font-bold text-[#404293] transition-colors hover:text-[#2f3378]"
        >
          Register here
        </button>
      </div>
    </div>
  );
}
