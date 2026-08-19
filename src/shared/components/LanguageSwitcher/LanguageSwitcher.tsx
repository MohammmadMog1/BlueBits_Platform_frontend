// src/shared/components/LanguageSwitcher/LanguageSwitcher.tsx
import { useEffect, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { useLanguage } from "../../i18n/useLanguage";
import type { AppLanguage } from "../../i18n/config";

type Variant = "menu" | "inline";

interface LanguageSwitcherProps {
  /** `menu` = زر + قائمة منسدلة (سطح المكتب). `inline` = أزرار ظاهرة (الجوال). */
  variant?: Variant;
  className?: string;
}

export default function LanguageSwitcher({
  variant = "menu",
  className = "",
}: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const { language, languages, supportedLanguages, changeLanguage } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة بالنقر خارجها أو بمفتاح Escape
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (next: AppLanguage) => {
    void changeLanguage(next);
    setOpen(false);
  };

  if (variant === "inline") {
    return (
      <div
        role="group"
        aria-label={t("language.change")}
        className={`flex items-center gap-1 rounded-xl p-1 ${
          isDark ? "bg-white/8" : "bg-gray-100"
        } ${className}`}
      >
        {supportedLanguages.map((code) => {
          const active = code === language;
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              aria-pressed={active}
              /* lang يخبر المتصفّح برسم كل اسم بخطّه واتجاهه الصحيحين */
              lang={code}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                active
                  ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-sm"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {languages[code].nativeName}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("language.current", { language: languages[language].nativeName })}
        title={t("language.change")}
        className={`flex items-center gap-1.5 rounded-xl p-2.5 transition-all ${
          isDark
            ? "bg-white/8 text-gray-400 hover:bg-white/15"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        <Languages className="h-[18px] w-[18px]" />
        <span className="text-[11px] font-black uppercase">{language}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t("language.label")}
          /* start-0 منطقي: يصير يميناً في RTL ويساراً في LTR تلقائياً */
          className={`absolute top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-2xl border shadow-xl start-0 ${
            isDark
              ? "border-white/10 bg-[#1a1b1e]"
              : "border-gray-200 bg-white"
          }`}
        >
          {supportedLanguages.map((code) => {
            const active = code === language;
            return (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => handleSelect(code)}
                lang={code}
                dir={languages[code].dir}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "text-[#404293]"
                    : isDark
                      ? "text-gray-300 hover:bg-white/8"
                      : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{languages[code].nativeName}</span>
                {active && <Check className="h-4 w-4 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
