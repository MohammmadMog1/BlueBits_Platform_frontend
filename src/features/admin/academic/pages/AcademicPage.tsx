import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import { headingClass, mutedClass } from "../../../../shared/utils/theme";
import YearsPanel from "../components/YearsPanel";
import SemestersPanel from "../components/SemestersPanel";

export default function AcademicPage() {
  const { t } = useTranslation("admin");
  const isDark = useIsDark();
  const [activeTab, setActiveTab] = useState<"years" | "semesters">("years");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
            <GraduationCap className="h-[18px] w-[18px] text-white" />
          </div>
          <h1 className={`text-xl font-black tracking-tight ${headingClass(isDark)}`}>
            {t("academic.title")}
          </h1>
        </div>
        <p className={`text-sm font-medium ${mutedClass(isDark)}`}>
          {t("academic.subtitle")}
        </p>
      </div>
      <div
        className={`flex w-fit gap-1 rounded-2xl border p-1.5 shadow-sm ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
        }`}
      >
        {(["years", "semesters"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md shadow-[#404293]/25"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "years" ? (
                <>
                  <GraduationCap size={15} /> {t("academic.tabYears")}
                </>
              ) : (
                <>
                  <Layers size={15} /> {t("academic.tabSemesters")}
                </>
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {activeTab === "years" ? (
          <motion.div
            key="years"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}
          >
            <YearsPanel isDark={isDark} />
          </motion.div>
        ) : (
          <motion.div
            key="semesters"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}
          >
            <SemestersPanel isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
