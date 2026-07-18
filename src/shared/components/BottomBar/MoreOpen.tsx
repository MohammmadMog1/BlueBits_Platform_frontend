import { useLocation } from "react-router-dom"; // أضفنا الـ import ناقص في كودك لـ location
import { Calendar, CalendarDays, Settings, Shield } from "lucide-react";

// حددنا الـ Props التي سيستقبلها الكومبوننت
interface MoreOpenIconProps {
  moreOpen: boolean;
  setMoreOpen: (open: boolean) => void;
}

export default function MoreOpenIcon({
  moreOpen,
  setMoreOpen,
}: MoreOpenIconProps) {
  const location = useLocation(); // تعريف الـ location لتجنب كراش التطبيق

  const handleNav = () => {
    setMoreOpen(false);
  };

  const sideNavItems = [
    { icon: Calendar, label: "Exam Schedule", path: "/app/exams/official" },
    { icon: CalendarDays, label: "My Schedule", path: "/app/exams/generate" },
  ];

  const adminItems = [
    { icon: Shield, label: "Admin Panel", path: "/app/admin" },
    { icon: Settings, label: "Settings", path: "/app" },
  ];

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {moreOpen && (
        <>
          {/* الخلفية المظلمة عند الضغط عليها تغلق القائمة */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />

          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t px-4 pt-3 pb-8 bg-white border-gray-200 shadow-2xl"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
            }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-5 bg-gray-300" />
            <div className="grid grid-cols-3 gap-3">
              {[...sideNavItems, ...adminItems].map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.path)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${active ? "bg-[#404293]/10 border-[#404293]/30" : "bg-gray-50 border-gray-200 hover:bg-[#404293]/5"}`}
                  >
                    <Icon
                      className={`w-6 h-6 ${active ? "text-[#404293]" : "text-gray-500"}`}
                    />
                    <span
                      className={`text-[11px] font-semibold text-center leading-tight ${active ? "text-[#404293]" : "text-gray-600"}`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
