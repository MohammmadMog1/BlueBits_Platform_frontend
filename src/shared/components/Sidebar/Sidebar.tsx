// src/shared/components/Sidebar/Sidebar.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ChevronRight, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import type { NavItem, UserProfile } from "../../layout/MainLayout/MainLayout";
import { useContextSwitch } from "../../hooks/useContextSwitch";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { getProfileImageUrl } from "../../utils/user";

interface SidebarProps {
  navItems: NavItem[];
  userProfile: UserProfile;
  onOpenProfile?: () => void;
  isProfileOpen?: boolean;
}

export default function Sidebar({
  navItems,
  userProfile,
  onOpenProfile,
  isProfileOpen,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { logout } = useAuth();
  const isDark = theme === "dark";

  const handleNav = (path: string) => navigate(path);
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/");
  };

  useEffect(() => {
    setAvatarImageFailed(false);
  }, [userProfile.profile_image]);

  const avatarUrl = avatarImageFailed ? null : getProfileImageUrl(userProfile.profile_image);

  // زر التبديل بين لوحة الإدارة وتطبيق المستخدم (مشترك مع BottomBar عبر useContextSwitch)
  const backButton = useContextSwitch(userProfile.role);

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
        className={`flex items-center justify-between px-4 lg:px-6 py-3.5 border-b flex-shrink-0 ${
          isDark ? "border-white/8" : "border-gray-200/80"
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
              <h2 className="text-[20px] font-bold text-[#404295]">BlueBits</h2>
              <p className="text-[12px] uppercase tracking-wider text-[#404293]">
                {userProfile.roleLabel}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${
            isDark ? "text-gray-400 hover:bg-white/8" : "text-gray-500 hover:bg-gray-100"
          }`}
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
        className={`border-t p-3 flex-shrink-0 ${
          isDark ? "border-white/8" : "border-gray-200/80"
        }`}
      >
        {/* ✨ Back Button الديناميكي */}
        {backButton && (
          <button
            onClick={() => handleNav(backButton.path)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
              isDark
                ? "text-gray-400 hover:bg-white/8 hover:text-white"
                : "text-gray-600 hover:bg-[#404293]/6 hover:text-[#404293]"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <backButton.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <span className="text-[14px] font-semibold truncate">{backButton.label}</span>
            )}
          </button>
        )}

        {/* User Card */}
        <div
          className={`mt-4 w-full flex items-center gap-1 rounded-xl p-1.5 -m-1.5 transition-colors ${
            isProfileOpen ? (isDark ? "bg-white/8" : "bg-[#404293]/8") : ""
          } ${collapsed ? "justify-center" : ""}`}
        >
          <button
            onClick={onOpenProfile}
            title={collapsed ? "My Profile" : ""}
            aria-pressed={isProfileOpen}
            className={`flex items-center flex-1 min-w-0 rounded-lg p-0.5 transition-colors ${
              isProfileOpen ? "" : isDark ? "hover:bg-white/8" : "hover:bg-[#404293]/6"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarImageFailed(true)}
                />
              ) : (
                <span className="text-white text-sm font-bold">
                  {userProfile.initials}
                </span>
              )}
            </div>
            {!collapsed && (
              <div className="ml-3 flex-1 min-w-0 text-left">
                <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-800"}`}>
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{userProfile.roleLabel}</p>
              </div>
            )}
          </button>

          {!collapsed && (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Log out"
              aria-label="Log out"
              className={`p-2 rounded-lg flex-shrink-0 transition-colors disabled:opacity-50 ${
                isDark
                  ? "text-gray-400 hover:bg-white/8 hover:text-red-400"
                  : "text-gray-400 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}