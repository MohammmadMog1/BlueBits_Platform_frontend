import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

// 1. استيراد الـ Hooks المخصصة والـ Thunk من الريدكس
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks"; 
import { registerThunk } from "../redux/authThunk";

type Props = {
    onNavigate?: (mode: 'login' | 'register' | 'verify') => void;
};

export default function RegisterForm({ onNavigate }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ [k: string]: string }>({});
    
    // 2. إعداد الـ Dispatch وجلب الحالة من الـ Redux Store
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (pass.length > 5) score++;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        return score;
    };

    const strength = calculateStrength(password);

    const getStrengthColor = () => {
        if (strength === 0) return 'bg-gray-600';
        if (strength <= 1) return 'bg-red-500';
        if (strength === 2) return 'bg-amber-500';
        if (strength === 3) return 'bg-emerald-400';
        return 'bg-green-500';
    };

    const getStrengthLabel = () => {
        if (password.length === 0) return '';
        if (strength <= 1) return 'Weak';
        if (strength === 2) return 'Fair';
        if (strength === 3) return 'Good';
        return 'Strong';
    };

    const validate = () => {
        const e: { [k: string]: string } = {};
        if (!name) e.name = 'Full Name is required';
        if (!email) e.email = 'Email is required';
        else if (!/^\S+@\S+$/.test(email)) e.email = 'Invalid email address';
        if (!password) e.password = 'Password is required';
        else if (password.length < 6) e.password = 'Min 6 characters';
        if (!confirmPassword) e.confirmPassword = 'Please confirm password';
        else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev?: React.FormEvent) => {
        ev?.preventDefault();
        if (!validate()) return;

        try {
            // 3. إرسال البيانات إلى الـ registerThunk بالريدكس ومتابعة النتيجة بـ .unwrap()
            await dispatch(registerThunk({ name, email, password })).unwrap();
            
            // 4. في حالة نجاح السيرفر بإنشاء الحساب، ننتقل فوراً لصفحة التحقق
            if (onNavigate) onNavigate('verify');
            else navigate('/verify');
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

    const goToLogin = () => {
        if (onNavigate) onNavigate('login');
        else navigate('/login');
    };

    return (
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-2xl rounded-[2rem] p-10 sm:p-12 w-full">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#202121] mb-3">Create Account</h2>
                <p className="text-gray-600">Join BlueBits today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <div className="relative">
                        <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.name ? 'text-red-400' : 'text-gray-500'}`} />
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            type="text"
                            placeholder="Full Name"
                            className={`w-full bg-gray-50 border ${errors.name ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-200 focus:ring-[#33529F]'} rounded-2xl py-4 pl-14 pr-5 text-[#202121] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-2 ml-3">{errors.name}</p>}
                </div>

                <div>
                    <div className="relative">
                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-500'}`} />
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email Address"
                            className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-200 focus:ring-[#33529F]'} rounded-2xl py-4 pl-14 pr-5 text-[#202121] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-2 ml-3">{errors.email}</p>}
                </div>

                <div>
                    <div className="relative">
                        <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-500'}`} />
                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-200 focus:ring-[#33529F]'} rounded-2xl py-4 pl-14 pr-14 text-[#202121] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#202121] transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between px-1">
                        <div className="flex gap-2 flex-1 mr-4">
                            {[1, 2, 3, 4].map(idx => (
                                <div key={idx} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${strength >= idx ? getStrengthColor() : 'bg-gray-200'}`} />
                            ))}
                        </div>
                        <span className={`text-xs uppercase font-bold w-14 text-right ${password ? 'text-gray-600' : 'text-gray-400'}`}>
                            {getStrengthLabel()}
                        </span>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-2 ml-3">{errors.password}</p>}
                </div>

                <div>
                    <div className="relative">
                        <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-gray-500'}`} />
                        <input
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className={`w-full bg-gray-50 border ${errors.confirmPassword ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-200 focus:ring-[#33529F]'} rounded-2xl py-4 pl-14 pr-5 text-[#202121] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 ml-3">{errors.confirmPassword}</p>}
                </div>

                {/* 5. عرض رسالة خطأ السيرفر من الريدكس */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                )}

                {/* 6. ربط الـ isLoading من الريدكس بالزر وتعطيله */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-lg rounded-2xl py-5 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#404293]/25 mt-6 disabled:opacity-70 disabled:hover:scale-100"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="mt-10 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button onClick={goToLogin} className="text-[#33529F] font-bold hover:text-[#202121] transition-colors">
                    Login here
                </button>
            </div>
        </div>
    );
}