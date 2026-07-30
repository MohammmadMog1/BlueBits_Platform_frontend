// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { LayoutDashboard, BookOpen, BrainCircuit, CheckSquare, MessageSquare, MoreHorizontal } from 'lucide-react';

// import MoreOpenIcon from './MoreOpen';


// const bottomNavItems = [
// 	{ icon: LayoutDashboard, label: 'Home', path: '/app' },
// 	{ icon: BookOpen, label: 'Lectures', path: '/app/lectures' },
// 	{ icon: BrainCircuit, label: 'MCQ', path: '/app/mcq' },
// 	{ icon: CheckSquare, label: 'Tasks', path: '/app/todo' },
// 	{ icon: MessageSquare, label: 'AI Chat', path: '/app/chatbot' },
// ];


// export default function BottomBar() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [moreOpen, setMoreOpen] = useState(false);

//     const handleNav = (path: string) => {
//         navigate(path);
//         setMoreOpen(false);
//     };

//     const isActive = (path: string) => {
//         if (path === '/app') return location.pathname === '/app';
//         return location.pathname.startsWith(path);
//     };

//     const isDark = false;

//     return (
//         <>
//             <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t ${isDark ? 'bg-[#1a1b1e]/98 border-white/10' : 'bg-white/98 border-gray-200/60'} shadow-2xl`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
//                 {bottomNavItems.map((item) => {
//                     const active = isActive(item.path);
//                     const Icon = item.icon;
//                     return (
//                         <button key={item.label} onClick={() => handleNav(item.path)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 ${active ? 'text-[#404293]' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
//                             {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />}
//                             <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[#404293]/10' : ''}`}>
//                                 <Icon className={`w-5 h-5 transition-all ${active ? 'scale-110' : ''}`} />
//                             </div>
//                             <span className={`text-[10px] font-semibold tracking-tight ${active ? 'text-[#404293]' : ''}`}>{item.label}</span>
//                         </button>
//                     );
//                 })}
                
//                 {/* زر المزيد يقوم بقلب الحالة الحالية */}
//                 <button onClick={() => setMoreOpen(!moreOpen)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
//                     <div className="p-1.5 rounded-xl">
//                         <MoreHorizontal className="w-5 h-5" />
//                     </div>
//                     <span className="text-[10px] font-semibold tracking-tight">More</span>
//                 </button>
//             </nav>
            
//             {/* 🌟 التعديل الجوهري هنا: مررنا الـ State والـ Setter للكومبوننت الإبن */}
//             <MoreOpenIcon moreOpen={moreOpen} setMoreOpen={setMoreOpen} />
//         </>
//     );
// }

// src/shared/components/BottomBar/BottomBar.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import MoreOpenIcon from './MoreOpen';
import type { NavItem } from '../../layout/MainLayout/MainLayout';

interface BottomBarProps {
  navItems: NavItem[];
  moreNavItems: NavItem[];
}

export default function BottomBar({ navItems, moreNavItems }: BottomBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const isDark = false;

  const handleNav = (path: string) => {
    navigate(path);
    setMoreOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // نأخذ أول 4 عناصر للشريط السفلي، والباقي يذهب لـ More (أو يمكنك تمرير مصفوفة منفصلة)
  const visibleBottomItems = navItems.slice(0, 4); 

  return (
    <>
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t ${isDark ? 'bg-[#1a1b1e]/98 border-white/10' : 'bg-white/98 border-gray-200/60'} shadow-2xl`} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {visibleBottomItems.map((item) => {
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
        
        {moreNavItems.length > 0 && (
          <button onClick={() => setMoreOpen(!moreOpen)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="p-1.5 rounded-xl">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">More</span>
          </button>
        )}
      </nav>
      
      <MoreOpenIcon moreOpen={moreOpen} setMoreOpen={setMoreOpen} navItems={moreNavItems} />
    </>
  );
}