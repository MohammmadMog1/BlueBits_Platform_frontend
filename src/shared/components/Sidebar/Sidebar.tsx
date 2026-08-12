import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ChevronRight, LogOut } from "lucide-react";
import type { NavItem, UserProfile } from "../../layout/MainLayout/MainLayout";

interface SidebarProps {
  navItems: NavItem[];
  userProfile: UserProfile;
}

export default function Sidebar({ navItems, userProfile }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = false;

  const handleNav = (path: string) => navigate(path);
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };
  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:relative z-30 h-full overflow-hidden transition-all duration-300 ease-in-out ${
        collapsed ? "lg:w-[72px]" : "lg:w-[252px]"
      } ${
        isDark
          ? "bg-[#1a1b1e]/98 border-r border-white/8"
          : "bg-white/98 border-r border-gray-200/80"
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-5 border-b ${
          isDark ? "border-white/8" : "border-gray-100"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
  <Link to={"/"}>
    <img
      className="h-10 w-auto object-contain flex-shrink-0"
      src="/src/app/assets/Logo notext.png"
      alt="Logo"
    />
  </Link>
  {!collapsed && (
    <div className="leading-tight">
      <h2 className="text-[20px] font-bold text-[#404295]">
        BlueBits
      </h2>

      <p className="text-[12px]  uppercase tracking-wider text-[#404293]">
                    {userProfile.roleLabel}
      </p>
    </div>
  )}
</div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 flex-shrink-0"
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${
              collapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>
<nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item.path)}
              title={collapsed ? item.label : ""}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md shadow-[#404293]/25"
                  : isDark
                  ? "text-gray-400 hover:bg-white/8 hover:text-white"
                  : "text-gray-600 hover:bg-[#404293]/6 hover:text-[#404293]"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-transform group-hover:scale-110 ${
                  active ? "text-white" : ""
                }`}
              />
              {!collapsed && (
                <span className="text-[13px] font-semibold truncate">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      {/* Footer */}
<div
  className={`border-t p-3 ${
    isDark ? "border-white/8" : "border-gray-200"
  }`}
>
  {/* Back To App */}
    <button
    onClick={() => handleNav("/user")}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-[#404293]/6 hover:text-[#404293] ${

      collapsed ? "justify-center" : ""
    }`}
  >
    <LogOut className="w-4 h-4 text-gray-500  
    hover:text-[#404293]" 
    />
    {!collapsed && (
      <span className="text-[14px] font-semibold">

        Back to App
      </span>
    )}
  </button>
  {/* User Card */}
  <div className={`mt-4 flex items-center hover:bg-[#404293]/6 hover:text-[#404293]   ${
    collapsed ? "justify-center" : ""
  }`}
  >
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB] flex items-center justify-center">
      <span className="text-white text-sm font-bold">
        {userProfile.initials}
      </span>
    </div>
    {!collapsed && (
      <>
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold ">
            {userProfile.name}
          </p>

          <p className="text-xs text-gray-400">
            {userProfile.roleLabel}
          </p>
        </div>
      </>
    )}
  </div>
</div>
    </aside>
  );
}