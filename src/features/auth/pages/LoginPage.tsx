import React from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
	return (
		<div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
			<div className="relative z-10 w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}

