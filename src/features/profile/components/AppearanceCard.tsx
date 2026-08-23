// src/features/profile/components/AppearanceCard.tsx
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Monitor, Palette } from "lucide-react";

const OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

export default function AppearanceCard() {
  const { t } = useTranslation("profile");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const active = theme ?? "system";

  return (
    <div
      className={`rounded-2xl border shadow-sm p-6 transition-colors ${
        isDark ? "bg-white/5 border-white/10" : "bg-white/98 border-gray-200/80"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2.5 rounded-xl flex-shrink-0 ${
            isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#404293]/10 text-[#404293]"
          }`}
        >
          <Palette className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className={`text-[15px] font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            {t("appearance.title")}
          </h2>
          <p className="text-[12px] mt-0.5 text-gray-400">{t("appearance.subtitle")}</p>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label={t("appearance.title")}
        className={`mt-4 grid grid-cols-3 gap-1.5 p-1.5 rounded-xl ${
          isDark ? "bg-black/20" : "bg-gray-100"
        }`}
      >
        {OPTIONS.map(({ value, icon: Icon }) => {
          const isActive = active === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg text-[12px] font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md shadow-[#404293]/25"
                  : isDark
                    ? "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(`appearance.${value}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
