import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BrainCircuit, CheckSquare, MessageSquare, MoreHorizontal } from 'lucide-react';

import MoreOpenIcon from './MoreOpen';


const bottomNavItems = [
	{ icon: LayoutDashboard, label: 'Home', path: '/app' },
	{ icon: BookOpen, label: 'Lectures', path: '/app/lectures' },
	{ icon: BrainCircuit, label: 'MCQ', path: '/app/mcq' },
	{ icon: CheckSquare, label: 'Tasks', path: '/app/todo' },
	{ icon: MessageSquare, label: 'AI Chat', path: '/app/chatbot' },
];

// const sideNavItems = [
// 	{ icon: Calendar, label: 'Exam Schedule', path: '/app/exams/official' },
// 	{ icon: CalendarDays, label: 'My Schedule', path: '/app/exams/generate' },
// ];

// const adminItems = [
// 	{ icon: Shield, label: 'Admin Panel', path: '/app/admin' },
// 	{ icon: Settings, label: 'Settings', path: '/app' },
// ];

// export default function BottomBar() {
// 	const navigate = useNavigate();
// 	const location = useLocation();
// 	const [moreOpen, setMoreOpen] = useState(false);

// 	const handleNav = (path: string) => {
// 		navigate(path);
// 		setMoreOpen(false);
// 	};

// 	const isActive = (path: string) => {
// 		if (path === '/app') return location.pathname === '/app';
// 		return location.pathname.startsWith(path);
// 	};

// 	const isDark = false;

// 	return (
// 		<>
// 			<nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t ${isDark ? 'bg-[#1a1b1e]/98 border-white/10' : 'bg-white/98 border-gray-200/60'} shadow-2xl`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
// 				{bottomNavItems.map((item) => {
// 					const active = isActive(item.path);
// 					const Icon = item.icon;
// 					return (
// 						<button key={item.label} onClick={() => handleNav(item.path)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 ${active ? 'text-[#404293]' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
// 							{active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />}
// 							<div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[#404293]/10' : ''}`}>
// 								<Icon className={`w-5 h-5 transition-all ${active ? 'scale-110' : ''}`} />
// 							</div>
// 							<span className={`text-[10px] font-semibold tracking-tight ${active ? 'text-[#404293]' : ''}`}>{item.label}</span>
// 						</button>
// 					);
// 				})}
// 				<button onClick={() => setMoreOpen(!moreOpen)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
// 					<div className="p-1.5 rounded-xl">
// 						<MoreHorizontal className="w-5 h-5" />
// 					</div>
// 					<span className="text-[10px] font-semibold tracking-tight">More</span>
// 				</button>
// 			</nav>
// 			{/* {moreOpen && (
// 				<>
// 					<div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMoreOpen(false)} />
// 					<div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t px-4 pt-3 pb-8 bg-white border-gray-200 shadow-2xl`} style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}>
// 						<div className="w-10 h-1 rounded-full mx-auto mb-5 bg-gray-300" />
// 						<div className="grid grid-cols-3 gap-3">
// 							{[...sideNavItems, ...adminItems].map((item) => {
// 								const active = isActive(item.path);
// 								const Icon = item.icon;
// 								return (
// 									<button key={item.label} onClick={() => handleNav(item.path)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${active ? 'bg-[#404293]/10 border-[#404293]/30' : 'bg-gray-50 border-gray-200 hover:bg-[#404293]/5'}`}>
// 										<Icon className={`w-6 h-6 ${active ? 'text-[#404293]' : 'text-gray-500'}`} />
// 										<span className={`text-[11px] font-semibold text-center leading-tight ${active ? 'text-[#404293]' : 'text-gray-600'}`}>{item.label}</span>
// 									</button>
// 								);
// 							})}
// 						</div>
// 					</div>
// 				</>
// 			)} */}
//  <MoreOpenIcon/>
			
// 		</>
// 	);
// }
export default function BottomBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [moreOpen, setMoreOpen] = useState(false);

    const handleNav = (path: string) => {
        navigate(path);
        setMoreOpen(false);
    };

    const isActive = (path: string) => {
        if (path === '/app') return location.pathname === '/app';
        return location.pathname.startsWith(path);
    };

    const isDark = false;

    return (
        <>
            <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t ${isDark ? 'bg-[#1a1b1e]/98 border-white/10' : 'bg-white/98 border-gray-200/60'} shadow-2xl`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
                {bottomNavItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                        <button key={item.label} onClick={() => handleNav(item.path)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 ${active ? 'text-[#404293]' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />}
                            <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[#404293]/10' : ''}`}>
                                <Icon className={`w-5 h-5 transition-all ${active ? 'scale-110' : ''}`} />
                            </div>
                            <span className={`text-[10px] font-semibold tracking-tight ${active ? 'text-[#404293]' : ''}`}>{item.label}</span>
                        </button>
                    );
                })}
                
                {/* زر المزيد يقوم بقلب الحالة الحالية */}
                <button onClick={() => setMoreOpen(!moreOpen)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div className="p-1.5 rounded-xl">
                        <MoreHorizontal className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-tight">More</span>
                </button>
            </nav>
            
            {/* 🌟 التعديل الجوهري هنا: مررنا الـ State والـ Setter للكومبوننت الإبن */}
            <MoreOpenIcon moreOpen={moreOpen} setMoreOpen={setMoreOpen} />
        </>
    );
}

