import { motion } from "motion/react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { resetPasswordThunk } from "../redux/authThunk";

// نفس الصور المستخدمة في صفحات الـ Authentication
import bgImage from "../../../app/assets/Logo.png";
import logoImage from "../../../app/assets/Logo notext.png";

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();

const token = searchParams.get("token");

  const dispatch = useAppDispatch();
  const { isLoading,error } = useAppSelector((state) => state.auth);

const handleSubmit = async () => {
  console.log("Button clicked");

  console.log("password:", password);
  console.log("confirmPassword:", confirmPassword);
  console.log("token:", token);

  if (!password.trim()) {
    console.log("Password is empty");
    return;
  }

  if (password !== confirmPassword) {
    console.log("Passwords don't match");
    setConfirmError("Passwords do not match");
    return;
  }

  console.log("Passed validation");

  if (!token) {
    console.log("Token is undefined");
    return;
  }

  console.log("Before dispatch");

  const result = await dispatch(
    resetPasswordThunk({
      token,
      password,
    })
  );

  console.log("Result:", result);

  if (resetPasswordThunk.fulfilled.match(result)) {
    console.log("Navigate");
    navigate("/auth/login", { replace: true });
  }
};

const getPasswordStrength = (password: string) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
};
const getStrengthColor = (level: number) => {
  switch (level) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-yellow-400";
    case 3:
      return "bg-blue-500";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-200";
  }
};

const passwordStrength = getPasswordStrength(password);
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#F1FFFA]/85 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img
            src={logoImage}
            alt="BlueBits"
            className="h-14 object-contain"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-2xl rounded-[2rem] p-10"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#404293]/20 to-[#2376BB]/20 flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-[#404293]" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#202121]">
              Reset Password
            </h1>

            <p className="text-gray-500 mt-3 leading-7">
              Create a new password for your account.
            </p>
          </div>

          {/* New Password */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                // type="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-14 pr-14 focus:outline-none focus:ring-2 focus:ring-[#33529F]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
              >
          {showPassword ? (
    <EyeOff className="w-5 h-5" />
  ) : (
    <Eye className="w-5 h-5" />
  )}
              </button>
            </div>
          </div>

{/* Password Strength */}
<div className="mb-6">
  <div className="flex gap-2">
    {[1, 2, 3, 4].map((level) => (
      <div
        key={level}
        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
          passwordStrength >= level
            ? getStrengthColor(passwordStrength)
            : "bg-gray-200"
        }`}
      />
    ))}
  </div>

  <p
    className={`text-xs mt-2 font-medium ${
      passwordStrength === 1
        ? "text-red-500"
        : passwordStrength === 2
        ? "text-yellow-500"
        : passwordStrength === 3
        ? "text-blue-500"
        : passwordStrength === 4
        ? "text-green-500"
        : "text-gray-500"
    }`}
  >
    {passwordStrength === 0 && "Very Weak"}
    {passwordStrength === 1 && "Weak"}
    {passwordStrength === 2 && "Medium"}
    {passwordStrength === 3 && "Strong"}
    {passwordStrength === 4 && "Very Strong"}
  </p>
</div>

            <p className="text-xs text-gray-500 mt-2">
               {passwordStrength === 0 && "Very Weak"}
    {passwordStrength === 1 && "Weak"}
    {passwordStrength === 2 && "Medium"}
    {passwordStrength === 3 && "Strong"}
    {passwordStrength === 4 && "Very Strong"}
            </p>
          {/* </div> */}

          {/* Confirm Password */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                // type="password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {setConfirmPassword(e.target.value);
                  if (confirmError) {setConfirmError("");}
}}
                placeholder="Confirm password"
                className={`w-full rounded-2xl 
                  border border-gray-200
                   bg-gray-50 py-4 pl-14 pr-14 
                   focus:outline-none focus:ring-2 focus:ring-[#33529F]${
                 confirmError
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-200 focus:ring-[#33529F]"
}`}
              />
              {confirmError && (
  <p className="mt-2 text-sm text-red-500">
    {confirmError}
  </p>
)}
              <button
  type="button"
  onClick={() =>
    setShowConfirmPassword(!showConfirmPassword)
  }
  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#404293]"
>
  {showConfirmPassword ? (
    <EyeOff className="w-5 h-5" />
  ) : (
    <Eye className="w-5 h-5" />
  )}
</button>
            </div>
          </div>
          {/* Button */}
          <button
            className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-semibold rounded-2xl py-4 hover:scale-[1.02] hover:opacity-90 transition-all"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Reset Password"}
            {/* Reset Password */}
          </button>
          {error && (
  <p className="mt-3 text-red-500 text-sm">
    {error}
  </p>
)}
          {/* Back */}
          <div className="mt-8 text-center">
            <Link
              to="/auth/login"
              className="text-[#404293] font-medium hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
