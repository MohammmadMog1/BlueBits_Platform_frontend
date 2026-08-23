import { useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence } from "motion/react";
import { Sparkles, LayoutGrid } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLatestLectures } from "../hooks/useLatestLectures";
import { LatestLectureCard } from "./LatestLectureCard";
import { AllLecturesModal } from "./AllLecturesModal";
import type { LecturePopulated } from "../types";

interface LatestLecturesSectionProps {
  onOpenLecture: (lecture: LecturePopulated) => void;
}

export function LatestLecturesSection({ onOpenLecture }: LatestLecturesSectionProps) {
  const { t } = useTranslation("lectures");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showAllModal, setShowAllModal] = useState(false);

  // نجيب كل المحاضرات المنشورة (بلا حد أقصى) حتى تعرضها نافذة "عرض الكل" كاملة
  const { latestLectures, loading } = useLatestLectures(Number.MAX_SAFE_INTEGER);
  const visibleLectures = latestLectures.slice(0, 5);

  if (loading || latestLectures.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8 md:mb-12">
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
        <h2
          className={`text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1.5 sm:gap-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500" />
          {t("latest.title")}
        </h2>
        {latestLectures.length > 5 && (
          <button
            onClick={() => setShowAllModal(true)}
            className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
              isDark
                ? "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                : "bg-[#404293]/6 text-[#404293] hover:bg-[#404293]/12"
            }`}
          >
            <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {t("latest.viewAll")}
          </button>
        )}
      </div>

      <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 scrollbar-hide snap-x">
        {visibleLectures.map((lecture) => (
          <LatestLectureCard key={lecture._id} lecture={lecture} onClick={onOpenLecture} />
        ))}
      </div>

      <AnimatePresence>
        {showAllModal && (
          <AllLecturesModal
            lectures={latestLectures}
            isDark={isDark}
            onClose={() => setShowAllModal(false)}
            onOpenLecture={onOpenLecture}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
