import { motion } from "motion/react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { forgotPasswordThunk } from "../redux/authThunk";
// import { navigate } from "react-router";
// import { useNavigate } from "react-router";

// استوردي نفس الصور المستخدمة في صفحة Login
import bgImage from "../../../app/assets/Logo notext.png";
import logoImage from "../../../app/assets/Logo.png";

export const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async () => {
    if (!email.trim()) return;

    // await dispatch(forgotPasswordThunk(email));
    const result = await dispatch(forgotPasswordThunk(email));

    if (forgotPasswordThunk.fulfilled.match(result)) {
      navigate("/check-email", {
        state: {
          email,
        },
      });
    }
  };

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
          <img src={logoImage} alt="BlueBits" className="h-14 object-contain" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-gray-200 shadow-2xl p-10"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#202121]">
              Forgot Password
            </h1>

            <p className="text-gray-500 mt-3 leading-7">
              Enter your email address and we'll send you a password reset link.
            </p>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-[#33529F] transition"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB]
            text-white font-semibold rounded-2xl py-4
            hover:scale-[1.02] hover:opacity-90 transition-all"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
            {/* Send Reset Link */}
          </button>

          {/* Back */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/auth/login"
              className="flex items-center gap-2 text-gray-500 hover:text-[#404293] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
