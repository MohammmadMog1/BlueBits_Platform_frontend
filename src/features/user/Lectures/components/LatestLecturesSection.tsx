import { useState } from "react";
import { useTheme } from "next-themes";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useLatestLectures } from "../hooks/useLatestLectures";
import { LatestLectureCard } from "./LatestLectureCard";
import type { LecturePopulated } from "../types";

interface LatestLecturesSectionProps {
  onOpenLecture: (lecture: LecturePopulated) => void;
}

export function LatestLecturesSection({ onOpenLecture }: LatestLecturesSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showAll, setShowAll] = useState(false);

  // نجيب 10 دايماً، ومنعرض 5 أو 10 حسب حالة showAll
  const { latestLectures, loading } = useLatestLectures(10);
  const visibleLectures = showAll ? latestLectures : latestLectures.slice(0, 5);

  if (loading || latestLectures.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8 md:mb-12">
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
        <h2
          className={`text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1.5 sm:gap-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-500" />
          Latest Lectures
        </h2>
        {latestLectures.length > 5 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className={`text-xs sm:text-sm md:text-base font-medium hover:underline flex items-center gap-1 sm:gap-1.5 ${isDark ? "text-[#33529F]" : "text-[#404293]"}`}
          >
            {showAll ? "Show Less" : "View All"}
            {showAll ? (
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            ) : (
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            )}
          </button>
        )}
      </div>

      <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 scrollbar-hide snap-x">
        {visibleLectures.map((lecture) => (
          <LatestLectureCard key={lecture._id} lecture={lecture} onClick={onOpenLecture} />
        ))}
      </div>
    </div>
  );
}