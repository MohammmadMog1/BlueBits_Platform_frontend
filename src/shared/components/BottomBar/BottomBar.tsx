// src/shared/components/BottomBar/BottomBar.tsx
import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import MoreOpenIcon from "./MoreOpen";
import type { NavItem, UserProfile } from "../../layout/MainLayout/MainLayout";
import { useNavigation } from "../../hooks/useNavigation";
import { useContextSwitch } from "../../hooks/useContextSwitch";

interface BottomBarProps {
  navItems: NavItem[];
  userProfile: UserProfile;
  maxVisible?: number; // عدد العناصر المرئية (افتراضي 4)
}

interface BottomBarLinkProps {
  item: NavItem;
  active: boolean;
  isDark: boolean;
  label: string;
}

function BottomBarLink({ item, active, isDark, label }: BottomBarLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 active:scale-95 ${
        active
          ? "text-[#404293]"
          : isDark
          ? "text-gray-500 hover:text-gray-300"
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {active && (
        /* التوسيط الأفقي فيزيائي عن قصد: المؤشّر مركزي في الاتجاهين */
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      )}
      <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-[#404293]/10" : ""}`}>
        <Icon
          aria-hidden="true"
          className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`}
        />
      </div>
      <span className="text-[10px] font-semibold tracking-tight">{label}</span>
    </Link>
  );
}

export default function BottomBar({ navItems, userProfile, maxVisible = 4 }: BottomBarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const { isActive } = useNavigation();
  const switchAction = useContextSwitch(userProfile.role);
  const { theme } = useTheme();
  const { t } = useTranslation(["common", "nav"]);
  const isDark = theme === "dark";

  const { visibleItems, moreItems } = useMemo(
    () => ({
      visibleItems: navItems.slice(0, maxVisible),
      moreItems: navItems.slice(maxVisible),
    }),
    [navItems, maxVisible]
  );

  const hasMore = moreItems.length > 0 || switchAction !== null;

  const toggleMore = useCallback(() => setMoreOpen((prev) => !prev), []);
  const closeMore = useCallback(() => setMoreOpen(false), []);

  return (
    <>
      <nav
        aria-label={t("nav:aria.bottomNav")}
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t shadow-2xl backdrop-blur-sm ${
          isDark ? "bg-[#1a1b1e]/98 border-white/8" : "bg-white/98 border-gray-200/60"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {visibleItems.map((item) => (
          <BottomBarLink
            key={item.path}
            item={item}
            label={t(item.labelKey)}
            active={isActive(item.path)}
            isDark={isDark}
          />
        ))}

        {hasMore && (
          <button
            onClick={toggleMore}
            aria-expanded={moreOpen}
            aria-controls="more-menu"
            aria-label={t("nav:aria.moreOptions")}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] relative transition-all duration-200 active:scale-95 ${
              isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className="relative p-1.5 rounded-xl">
              <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
              {switchAction && (
                <span className="absolute top-0.5 end-0.5 w-2 h-2 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB] ring-2 ring-white dark:ring-[#1a1b1e]" />
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight">
              {t("actions.more")}
            </span>
          </button>
        )}
      </nav>

      <MoreOpenIcon
        isOpen={moreOpen}
        onClose={closeMore}
        navItems={moreItems}
        switchAction={switchAction}
      />
    </>
  );
}
