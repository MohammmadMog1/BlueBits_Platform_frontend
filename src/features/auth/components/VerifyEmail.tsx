import React, { useEffect, useState } from 'react';
import { Mail, RefreshCcw, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Props = {
  onNavigate?: (mode: 'login' | 'register' | 'verify') => void;
};

export default function VerifyEmail({ onNavigate }: Props) {
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setIsResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsResending(false);
    setCountdown(30);
  };

  const goToLogin = () => {
    if (onNavigate) onNavigate('login');
    else navigate('/login');
  };

  return (
    <div className="bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-2xl rounded-[2rem] p-10 sm:p-14 w-full text-center">
      <div className="mx-auto w-28 h-28 bg-gradient-to-br from-[#404293]/20 to-[#2376BB]/20 rounded-full flex items-center justify-center mb-10 border border-gray-200 shadow-lg shadow-[#404293]/10 relative">
        <div className="absolute inset-0 rounded-full animate-ping border border-[#404293]/30 opacity-50" style={{ animationDuration: '3s' }} />
        <Mail className="w-12 h-12 text-[#404293]" />
      </div>

      <h2 className="text-3xl font-bold text-[#202121] mb-5">Verify Your Email</h2>

      <p className="text-gray-600 mb-12 leading-relaxed text-base sm:text-base">
        We have sent a confirmation link to your email.
        <br className="hidden sm:block" />
        Please check your inbox and click the link to activate your account.
      </p>

      <div className="space-y-5">
        <button
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className="w-full bg-gray-100 border border-gray-200 text-[#202121] font-bold text-lg rounded-2xl py-5 flex items-center justify-center gap-2 hover:bg-gray-200 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md"
        >
          {isResending ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
          {countdown > 0 ? `Resend Email in ${countdown}s` : 'Resend Email'}
        </button>

        <button
          onClick={goToLogin}
          className="w-full text-gray-600 font-medium py-4 flex items-center justify-center gap-2 hover:text-[#202121] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </div>
  );
}
