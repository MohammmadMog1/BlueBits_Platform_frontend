import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	LayoutDashboard,
	BookOpen,
	BrainCircuit,
	CheckSquare,
	Calendar,
	CalendarDays,
	MessageSquare,
	Settings,
	LogOut,
	ChevronRight,
	Shield,
} from 'lucide-react';

const sideNavItems = [
	{ icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
	{ icon: BookOpen, label: 'Lectures', path: '/app/lectures' },
	{ icon: BrainCircuit, label: 'MCQ Practice', path: '/app/mcq' },
	{ icon: CheckSquare, label: 'To-Do & Pomodoro', path: '/app/todo' },
	{ icon: Calendar, label: 'Exam Schedule', path: '/app/exams/official' },
	{ icon: CalendarDays, label: 'My Schedule', path: '/app/exams/generate' },
	{ icon: MessageSquare, label: 'AI Chatbot', path: '/app/chatbot' },
];

const adminItems = [
	{ icon: Shield, label: 'Admin Panel', path: '/app/admin' },
	{ icon: Settings, label: 'Settings', path: '/app' },
];

export default function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handleNav = (path: string) => {
		navigate(path);
	};

	const isActive = (path: string) => {
		if (path === '/app') return location.pathname === '/app';
		return location.pathname.startsWith(path);
	};

	const isDark = false;

	return (
		<aside className={`hidden lg:flex lg:flex-col lg:relative z-30 h-full transition-all duration-300 ease-in-out ${collapsed ? 'lg:w-[72px]' : 'lg:w-[252px]'} ${isDark ? 'bg-[#1a1b1e]/98 border-r border-white/8' : 'bg-white/98 border-r border-gray-200/80'}`}>
			<div className={`flex items-center justify-between px-4 py-5 border-b ${isDark ? 'border-white/8' : 'border-gray-100'}`}>
				{!collapsed ? (
					<div className="h-8 text-lg font-bold">
						<img src='Logo.png'/>
					</div>
				) : (
					<div className="h-8 w-8 flex items-center justify-center">	
					<img src='Logo.png'/>
						</div>
				)}
				<button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg">
					<ChevronRight className={`w-4 h-4 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
				</button>
			</div>

			<nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
				{sideNavItems.map((item) => {
					const active = isActive(item.path);
					const Icon = item.icon;
					return (
						<button key={item.label} onClick={() => handleNav(item.path)} title={collapsed ? item.label : ''} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md' : isDark ? 'text-gray-400 hover:bg-white/8 hover:text-white' : 'text-gray-600 hover:bg-[#404293]/6 hover:text-[#404293]'} ${collapsed ? 'justify-center' : ''}`}>
							<Icon className="w-[18px] h-[18px] flex-shrink-0" />
							{!collapsed && <span className="text-[13px] font-semibold truncate">{item.label}</span>}
						</button>
					);
				})}

				<div className={`my-3 border-t ${isDark ? 'border-white/8' : 'border-gray-100'}`} />
				{!collapsed && <p className={`px-3 text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Management</p>}

				{adminItems.map((item) => {
					const active = isActive(item.path) && item.path !== '/app';
					const Icon = item.icon;
					return (
						<button key={item.label} onClick={() => handleNav(item.path)} title={collapsed ? item.label : ''} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md' : isDark ? 'text-gray-400 hover:bg-white/8 hover:text-white' : 'text-gray-600 hover:bg-[#404293]/6 hover:text-[#404293]'} ${collapsed ? 'justify-center' : ''}`}>
							<Icon className="w-[18px] h-[18px] flex-shrink-0" />
							{!collapsed && <span className="text-[13px] font-semibold">{item.label}</span>}
						</button>
					);
				})}
			</nav>

			<div className={`p-3 border-t ${isDark ? 'border-white/8' : 'border-gray-100'}`}>
				<div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isDark ? 'hover:bg-white/8' : 'hover:bg-gray-50'}`}>
					<div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center flex-shrink-0 shadow-md">
						<span className="text-white text-xs font-bold">AH</span>
					</div>
					{!collapsed && (
						<>
							<div className="flex-1 min-w-0">
								<p className={`text-[13px] font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>Ahmed Hassan</p>
								<p className={`text-[11px] truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Student · CS Dept</p>
							</div>
							<LogOut className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
						</>
					)}
				</div>
			</div>
		</aside>
	);
}

