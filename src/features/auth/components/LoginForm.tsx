import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const MOCK_USERS = [
	{ email: 'student@bluebits.com', password: '123456', name: 'Ahmed Hassan' },
	{ email: 'admin@bluebits.com',   password: 'admin123', name: 'Admin User' },
];

type Props = {
	onNavigate?: (mode: 'login' | 'register' | 'verify') => void;
};

export default function LoginForm({ onNavigate }: Props) {
	const [showPassword, setShowPassword] = useState(false);
	const [loginError, setLoginError] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const validate = () => {
		const e: { email?: string; password?: string } = {};
		if (!email) e.email = 'Email is required';
		else if (!/^\S+@\S+$/i.test(email)) e.email = 'Invalid email address';
		if (!password) e.password = 'Password is required';
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const handleSubmit = async (ev?: React.FormEvent) => {
		ev?.preventDefault();
		if (!validate()) return;
		setLoginError('');
		setIsSubmitting(true);
		await new Promise(r => setTimeout(r, 800));
		const user = MOCK_USERS.find(u => u.email === email && u.password === password);
		setIsSubmitting(false);
		if (user) {
			localStorage.setItem('bb_user', JSON.stringify({ name: user.name, email: user.email }));
			navigate('/app');
		} else {
			setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
		}
	};

	const goToRegister = () => {
		if (onNavigate) onNavigate('register');
		else navigate('/register');
	};

	return (
		<div className="bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-2xl rounded-[2rem] p-10 sm:p-12 w-full">
			<div className="text-center mb-10">
				<h2 className="text-3xl font-bold text-[#202121] mb-3">Welcome Back</h2>
				<p className="text-gray-600">Login to your account to continue</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
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
					{errors.email && (
						<p className="text-red-500 text-sm mt-2 ml-3 flex items-center gap-1.5">
							<AlertCircle className="w-3.5 h-3.5" /> {errors.email}
						</p>
					)}
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
					{errors.password && (
						<p className="text-red-500 text-sm mt-2 ml-3 flex items-center gap-1.5">
							<AlertCircle className="w-3.5 h-3.5" /> {errors.password}
						</p>
					)}
				</div>

				<div className="flex justify-end">
					<a href="#" className="text-sm text-[#404293] hover:text-[#33529F] hover:underline transition-colors font-medium">
						Forgot Password?
					</a>
				</div>

				{loginError && (
					<div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-red-600 text-sm">
						<AlertCircle className="w-4 h-4 shrink-0" /> {loginError}
					</div>
				)}

				<div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
					<p className="font-semibold mb-1">حساب تجريبي:</p>
					<p>📧 student@bluebits.com</p>
					<p>🔑 123456</p>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-lg rounded-2xl py-5 flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-[#404293]/25 disabled:opacity-70 disabled:hover:scale-100 mt-2"
				>
					{isSubmitting ? 'Logging in...' : 'Login'}
					{!isSubmitting && <ArrowRight className="w-5 h-5" />}
				</button>
			</form>

			<div className="mt-10 text-center text-sm text-gray-600">
				Don't have an account?{' '}
				<button onClick={goToRegister} className="text-[#33529F] font-bold hover:text-[#202121] transition-colors">
					Register here
				</button>
			</div>
		</div>
	);
}

