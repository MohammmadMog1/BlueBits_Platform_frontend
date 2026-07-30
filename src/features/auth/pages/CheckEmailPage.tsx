import { motion } from "motion/react";
import { MailCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useAppDispatch } from "../../../../src/App/store/hooks";
import { forgotPasswordThunk } from "../redux/authThunk";
import { useLocation } from "react-router";



import bgImage from "../../../app/assets/Logo notext.png";
import logoImage from "../../../app/assets/Logo.png";

export const CheckEmailPage = () => {
    const dispatch = useAppDispatch();
    const { state } = useLocation();

const email = state?.email;

    const handleResend = async () => {
  await dispatch(forgotPasswordThunk(email));
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
          className="bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-gray-200 shadow-2xl p-10"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <MailCheck className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#202121]">
              Check Your Email
            </h1>

            <p className="text-gray-500 mt-3 leading-7">
              We've sent a password reset link to your email address.
              <br />
              Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>

          {/* Resend */}
          <button
            className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB]
            text-white font-semibold rounded-2xl py-4
            hover:scale-[1.02] hover:opacity-90 transition-all"
            onClick={handleResend}
          >
            Resend Email
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
