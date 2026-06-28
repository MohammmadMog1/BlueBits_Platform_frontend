import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";

type Props = {
  onNavigate?: (mode: "login" | "register" | "verify") => void;
};

export default function RegisterForm({ onNavigate }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

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
  const getStrengthMeta = () => {
    if (!password) return { color: "bg-slate-200", textColor: "text-slate-400", label: "" };
    
    switch (strength) {
      case 1:
        return { color: "bg-rose-500", textColor: "text-rose-500", label: "Weak" };
      case 2:
        return { color: "bg-amber-500", textColor: "text-amber-500", label: "Fair" };
      case 3:
        return { color: "bg-indigo-500", textColor: "text-indigo-500", label: "Good" };
      case 4:
        return { color: "bg-emerald-500", textColor: "text-emerald-500", label: "Strong" };
      default:
        return { color: "bg-rose-500", textColor: "text-rose-500", label: "Weak" };
    }
  };

  const { color: strengthColor, textColor: strengthTextColor, label: strengthLabel } = getStrengthMeta();

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!name) e.name = "Full Name is required";
    if (!email) e.email = "Email is required";
    else if (!/^\S+@\S+$/.test(email)) e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Min 6 characters";
    if (!confirmPassword) e.confirmPassword = "Please confirm password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
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
    else navigate("/login");
  };

  return (
    <div className="w-full rounded-[1.75rem] border border-white/30 bg-white/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-slate-900">
          Create Account
        </h2>
        <p className="text-sm text-slate-600">Join BlueBits today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Input */}
        <div>
          <div className="relative">
            <User
              className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.name ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className={`w-full border ${errors.name ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 pl-14 pr-5 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-2 ml-3">{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <div className="relative">
            <Mail
              className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              className={`w-full border ${errors.email ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 pl-14 pr-5 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 ml-3">{errors.email}</p>
          )}
        </div>

        {/* Password Input & Strength Indicator */}
        <div>
          <div className="relative">
            <Lock
              className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full border ${errors.password ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 pl-14 pr-14 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
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
            <div className="flex gap-1.5 flex-1 mr-4">
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
              className={`text-xs uppercase font-extrabold w-14 text-right transition-colors duration-300 ${strengthTextColor}`}
            >
              {strengthLabel}
            </span>
          </div>
          
          {errors.password && (
            <p className="text-red-500 text-sm mt-2 ml-3">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <div className="relative">
            <Lock
              className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.confirmPassword ? "text-red-400" : "text-gray-500"}`}
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full border ${errors.confirmPassword ? "border-red-400/60 bg-red-50 focus:ring-red-500" : "border-slate-200 bg-slate-50 focus:ring-[#404293]"} rounded-2xl py-4 pl-14 pr-5 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-2 ml-3">
              {errors.confirmPassword}
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
          className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-lg rounded-2xl py-5 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#404293]/25 mt-6 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <button
          onClick={goToLogin}
          className="font-bold text-[#404293] transition-colors hover:text-[#2f3378]"
        >
          Login here
        </button>
      </div>
    </div>
  );
}