import { Sun, Moon, Menu, X, BookOpen, LayoutDashboard, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ✅ 1. استيراد Redux
import { useAppSelector, useAppDispatch } from "../../auth/redux/hooks";
import { logoutThunk } from "../../auth/redux/authThunk";
import { getProfileImageUrl } from "../../../shared/utils/user";
import ProfileDrawer from "../../profile/components/ProfileDrawer";

interface NavbarProps {
  scrolled: boolean;
  isDark: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setTheme: (theme: string) => void;
  navigate: (path: string) => void;
  LogoImg: string;
}

export function Navbar({
  scrolled,
  isDark,
  mobileMenuOpen,
  setMobileMenuOpen,
  setTheme,
  navigate,
  LogoImg,
}: NavbarProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/");
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const getAvatarContent = () => {
    const avatarUrl = avatarImageFailed ? null : getProfileImageUrl(user?.profile_image);
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={user?.name}
          className="w-full h-full object-cover rounded-full"
          onError={() => setAvatarImageFailed(true)}
        />
      );
    }
    return (
      <span className="text-white font-bold text-sm">
        {(user?.name || user?.email)?.charAt(0).toUpperCase()}
      </span>
    );
  };

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? isDark
            ? "bg-[#08090d]/90 border-white/10 shadow-2xl backdrop-blur-xl"
            : "bg-white/90 border-slate-200 shadow-lg backdrop-blur-xl"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <img
          src={LogoImg}
          alt="BlueBits"
          className="h-7 sm:h-12 object-contain flex-shrink-0 transition-transform hover:scale-105"
        />

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {[
            ["Features", "#features"],
            ["About", "#about"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              className={`text-sm font-semibold transition-all duration-300 relative group ${
                isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#404293]"
              }`}
            >
              {l}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#404293] to-[#2376BB] group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isDark
                ? "bg-white/5 hover:bg-white/10 text-yellow-400 hover:scale-110"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:scale-110"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* ✅ زر المحاضرات */}
          <button
            onClick={() => navigate("/user/lectures")}
            className={`hidden md:flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-300 ${
              isDark
                ? "bg-gradient-to-r from-[#404293]/20 to-[#2376BB]/20 text-[#9fa8e8] hover:from-[#404293]/30 hover:to-[#2376BB]/30 border border-[#404293]/30"
                : "bg-gradient-to-r from-[#404293]/10 to-[#2376BB]/10 text-[#404293] hover:from-[#404293]/20 hover:to-[#2376BB]/20 border border-[#404293]/20"
            } hover:scale-105`}
          >
            <BookOpen className="w-4 h-4" />
            Lectures
          </button>

          {/* ✅ زر الداشبورد بجانب زر المحاضرات (فقط عند تسجيل الدخول) */}
          {isAuthenticated && user && (
            <button
              onClick={() => navigate("/user")}
              className={`hidden md:flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-[#404293]/20 to-[#2376BB]/20 text-[#9fa8e8] hover:from-[#404293]/30 hover:to-[#2376BB]/30 border border-[#404293]/30"
                  : "bg-gradient-to-r from-[#404293]/10 to-[#2376BB]/10 text-[#404293] hover:from-[#404293]/20 hover:to-[#2376BB]/20 border border-[#404293]/20"
              } hover:scale-105`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          )}

          {/* ✅ Authenticated User - Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 border border-white/10"
                    : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
                } hover:scale-105`}
              >
                {/* Avatar - بدون النقطة الخضراء */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB] flex items-center justify-center shadow-lg overflow-hidden">
                  {getAvatarContent()}
                </div>

                {/* User Info */}
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                    {user.name || user.email?.split("@")[0]}
                  </span>
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {user.role?.replace("_", " ")}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  } ${isDark ? "text-gray-400" : "text-gray-500"}`}
                />
              </button>

              {/* Dropdown Menu - بدون زر Dashboard */}
              {profileDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    isDark
                      ? "bg-[#0f1015] border border-white/10"
                      : "bg-white border border-slate-200"
                  }`}
                >
                  {/* User Info Header */}
                  <div
                    className={`px-4 py-3 border-b ${
                      isDark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                      {user.name}
                    </p>
                    <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isDark
                          ? "text-gray-300 hover:bg-white/5"
                          : "text-gray-700 hover:bg-slate-50"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isDark
                          ? "text-gray-300 hover:bg-white/5"
                          : "text-gray-700 hover:bg-slate-50"
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className={`border-t ${isDark ? "border-white/10" : "border-slate-100"}`}>
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-red-500 hover:bg-red-500/10 disabled:opacity-50`}
                    >
                      <LogOut className="w-4 h-4" />
                      {isLoading ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ✅ Not Authenticated - Login/Register Buttons */
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/auth/login")}
                className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  isDark
                    ? "text-gray-300 hover:bg-white/5 border border-white/10"
                    : "text-[#404293] hover:bg-[#404293]/5 border border-[#404293]/30"
                } hover:scale-105`}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-lg shadow-[#404293]/30 hover:shadow-xl hover:shadow-[#404293]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-all duration-300 ${
              isDark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-5 space-y-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            isDark
              ? "border-white/10 bg-[#08090d]/98 text-white"
              : "border-slate-100 bg-white/98 text-slate-900"
          }`}
        >
          {/* Navigation Links */}
          {[
            ["Features", "#features"],
            ["About", "#about"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              className={`block text-base font-semibold py-2.5 px-3 rounded-xl transition-all ${
                isDark ? "text-gray-300 hover:bg-white/5" : "text-gray-700 hover:bg-slate-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {l}
            </a>
          ))}

          {/* ✅ أزرار المحاضرات والداشبورد جنب بعض */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigate("/user/lectures");
                setMobileMenuOpen(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-3 rounded-xl transition-all ${
                isDark
                  ? "bg-gradient-to-r from-[#404293]/20 to-[#2376BB]/20 text-[#9fa8e8] border border-[#404293]/30"
                  : "bg-gradient-to-r from-[#404293]/10 to-[#2376BB]/10 text-[#404293] border border-[#404293]/20"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Lectures
            </button>

            {isAuthenticated && user && (
              <button
                onClick={() => {
                  navigate("/user");
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-3 rounded-xl transition-all ${
                  isDark
                    ? "bg-gradient-to-r from-[#404293]/20 to-[#2376BB]/20 text-[#9fa8e8] border border-[#404293]/30"
                    : "bg-gradient-to-r from-[#404293]/10 to-[#2376BB]/10 text-[#404293] border border-[#404293]/20"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            )}
          </div>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <>
              {/* User Profile Card */}
              <button
                onClick={() => {
                  setIsProfileOpen(true);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isDark
                    ? "bg-white/5 border border-white/10 hover:bg-white/10"
                    : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB] flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  {getAvatarContent()}
                </div>
                <div className="flex flex-col overflow-hidden flex-1 text-left">
                  <span className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-800"}`}>
                    {user.name || user.email}
                  </span>
                  <span className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {user.email}
                  </span>
                </div>
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 px-3 rounded-xl transition-all text-red-500 hover:bg-red-500/10 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  navigate("/auth/login");
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 text-sm font-bold py-2.5 rounded-xl transition-all ${
                  isDark
                    ? "border border-white/10 text-gray-300 hover:bg-white/5"
                    : "border border-[#404293]/30 text-[#404293] hover:bg-[#404293]/5"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/auth/register");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 text-sm font-bold py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-lg active:scale-[0.98] transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
    <ProfileDrawer open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}