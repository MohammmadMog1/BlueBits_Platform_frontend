// src/shared/components/BottomBar/MoreOpen.tsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import type { NavItem } from "../../layout/MainLayout/MainLayout";
import type { ContextSwitchAction } from "../../hooks/useContextSwitch";
import { useNavigation } from "../../hooks/useNavigation";

interface MoreOpenIconProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  switchAction?: ContextSwitchAction | null;
}

export default function MoreOpenIcon({
  isOpen,
  onClose,
  navItems,
  switchAction,
}: MoreOpenIconProps) {
  const { handleNav, isActive } = useNavigation();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Focus trap و Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    // Focus على زر الإغلاق عند الفتح
    closeButtonRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // منع التمرير

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-menu-title"
        id="more-menu"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t px-4 pt-3 pb-8 shadow-2xl animate-slideUp ${
          isDark ? "bg-[#1a1b1e] border-white/8" : "bg-white border-gray-200"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-1 rounded-full mx-auto ${isDark ? "bg-white/15" : "bg-gray-300"}`} />
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </button>
        </div>

        <h2 id="more-menu-title" className="sr-only">
          More navigation options
        </h2>

        {/* Switch area action (Admin <-> User) */}
        {switchAction && (
          <Link
            to={switchAction.path}
            onClick={() => handleNav(switchAction.path, onClose)}
            className="flex items-center gap-3 w-full p-4 mb-4 rounded-2xl text-white bg-gradient-to-r from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25 active:scale-[0.98] transition-transform"
          >
            <switchAction.icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-sm font-semibold text-left">{switchAction.label}</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-80" />
          </Link>
        )}

        {/* Grid */}
        {navItems.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => handleNav(item.path, onClose)}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all active:scale-95 ${
                    active
                      ? "bg-[#404293]/10 border-[#404293]/30"
                      : isDark
                      ? "bg-white/5 border-white/10 hover:bg-[#404293]/10 hover:border-[#404293]/30"
                      : "bg-gray-50 border-gray-200 hover:bg-[#404293]/5 hover:border-[#404293]/20"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      active ? "text-[#404293]" : isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-semibold text-center leading-tight ${
                      active ? "text-[#404293]" : isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
