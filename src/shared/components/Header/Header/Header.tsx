import { useEffect, useState } from "react";
import { Search, Sun, Moon, Bell } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import imge from "../../../../app/assets/Logo.png"
import { Link } from "react-router-dom";
import  type { UserProfile } from "../../../layout/MainLayout/MainLayout";
import { getProfileImageUrl } from "../../../utils/user";
import LanguageSwitcher from "../../LanguageSwitcher/LanguageSwitcher";

interface HeaderProps {
  userProfile: UserProfile;
  onOpenProfile?: () => void;
  isProfileOpen?: boolean;
}

export default function Header({ userProfile, onOpenProfile, isProfileOpen }: HeaderProps) {
  const [notifications, setNotifications] = useState(3);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  useEffect(() => {
    setAvatarImageFailed(false);
  }, [userProfile.profile_image]);

  const avatarUrl = avatarImageFailed ? null : getProfileImageUrl(userProfile.profile_image);

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
          <Link to={"/"}>
        <div className="lg:hidden text-lg font-bold">
          <img  className="h-10 w-auto"src={imge} alt="Logo" />
        </div>
          </Link>

        <div
          className={`hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-xl w-64 lg:w-72 border border-transparent transition-all duration-200 focus-within:w-72 focus-within:lg:w-80 focus-within:border-[#2376BB]/30 focus-within:shadow-sm ${
            isDark
              ? "bg-white/5 hover:bg-white/8 focus-within:bg-white/8"
              : "bg-gray-50 hover:bg-gray-100 focus-within:bg-white"
          }`}
        >
          <Search
            aria-hidden="true"
            className={`w-4 h-4 flex-shrink-0 transition-colors ${isDark ? "text-gray-500" : "text-gray-400"}`}
          />
          <input
            type="search"
            aria-label={t("actions.search")}
            placeholder={t("actions.searchPlaceholder")}
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
          aria-label={t("actions.search")}
          className={`md:hidden p-2.5 rounded-xl transition-colors ${
            isDark
              ? "hover:bg-white/10 text-gray-400"
              : "hover:bg-gray-100 text-gray-500"
          }`}
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        <LanguageSwitcher />

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
          className={`relative overflow-hidden p-2.5 rounded-xl transition-all active:scale-90 ${
            isDark
              ? "bg-white/8 hover:bg-white/15 text-yellow-400"
              : "bg-gray-100 hover:bg-gray-200 text-gray-500"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.span
                key="sun"
                initial={{ rotate: -70, opacity: 0, scale: 0.4 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 70, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="block"
              >
                <Sun className="w-[18px] h-[18px]" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate: 70, opacity: 0, scale: 0.4 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -70, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="block"
              >
                <Moon className="w-[18px] h-[18px]" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => setNotifications(0)}
          /* صيغ الجمع العربية الست يتكفّل بها i18next عبر مفاتيح count_* */
          aria-label={t("notifications.count", { count: notifications })}
          className={`relative p-2.5 rounded-xl transition-all active:scale-90 ${
            isDark
              ? "bg-white/8 hover:bg-white/15 text-gray-400"
              : "bg-gray-100 hover:bg-gray-200 text-gray-500"
          }`}
        >
          <Bell className="w-[18px] h-[18px]" aria-hidden="true" />
          {notifications > 0 && (
            /* end-1.5 منطقي: أعلى اليسار في RTL وأعلى اليمين في LTR */
            <span className="absolute top-1.5 end-1.5 flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
              <span className="relative w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1a1b1e]" />
            </span>
          )}
        </button>

        <button
          onClick={onOpenProfile}
          aria-label={t("profile.open")}
          aria-pressed={isProfileOpen}
          className={`w-9 h-9 rounded-full bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md flex-shrink-0 ring-2 transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden ${
            isProfileOpen ? "ring-[#404293]/40" : "ring-transparent hover:ring-[#404293]/30"
          }`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
              onError={() => setAvatarImageFailed(true)}
            />
          ) : (
            <span className="text-white text-xs font-bold">
              {userProfile.initials}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
