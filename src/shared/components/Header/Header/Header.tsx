import { useState } from "react";
import { Search, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import imge from "../../../../app/aett/Logo.png"
import { Link } from "react-router-dom";

export default function Header() {
  const [notifications, setNotifications] = useState(3);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className={`flex items-center justify-between px-4 lg:px-6 py-3.5 border-b flex-shrink-0
			 ${
         isDark
           ? "bg-[#1a1b1e]/98 border-white/8 backdrop-blur-xl"
           : "bg-white/98 border-gray-200/80 backdrop-blur-xl"
       } shadow-sm`}
    >
      <div className="flex items-center gap-3">
          <Link to={"/LandingPage"}>
        <div className="lg:hidden text-lg font-bold">
          <img src={imge} alt="Logo" />
        </div>
          </Link>

        <div
          className={`hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-xl w-64 lg:w-72 transition-colors ${
            isDark
              ? "bg-white/5 hover:bg-white/8"
              : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <Search
            className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`}
          />
          <input
            type="text"
            placeholder="Search..."
            className={`bg-transparent text-sm w-full outline-none ${
              isDark
                ? "text-white placeholder-gray-600"
                : "text-gray-700 placeholder-gray-400"
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={`md:hidden p-2.5 rounded-xl transition-colors ${
            isDark
              ? "hover:bg-white/10 text-gray-400"
              : "hover:bg-gray-100 text-gray-500"
          }`}
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`p-2.5 rounded-xl transition-all ${
            isDark
              ? "bg-white/8 hover:bg-white/15 text-yellow-400"
              : "bg-gray-100 hover:bg-gray-200 text-gray-500"
          }`}
        >
          {isDark ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        <button
          onClick={() => setNotifications(0)}
          className={`relative p-2.5 rounded-xl transition-all ${
            isDark
              ? "bg-white/8 hover:bg-white/15 text-gray-400"
              : "bg-gray-100 hover:bg-gray-200 text-gray-500"
          }`}
        >
          <Bell className="w-[18px] h-[18px]" />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1a1b1e]" />
          )}
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center cursor-pointer shadow-md flex-shrink-0">
          <span className="text-white text-xs font-bold">AH</span>
        </div>
      </div>
    </header>
  );
}
