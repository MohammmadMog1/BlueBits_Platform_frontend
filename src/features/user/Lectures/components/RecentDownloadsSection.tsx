import { useTheme } from "next-themes";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRecentDownloads } from "../hooks/useRecentDownloads";
import { LatestLectureCard } from "./LatestLectureCard";
import type { LecturePopulated } from "../types";

interface RecentDownloadsSectionProps {
  onOpenLecture: (lecture: LecturePopulated) => void;
}

export function RecentDownloadsSection({ onOpenLecture }: RecentDownloadsSectionProps) {
  const { t } = useTranslation("lectures");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { recentLectures, loading } = useRecentDownloads(8);

  if (loading || recentLectures.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8 md:mb-12">
      <h2
        className={`text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-6 ${isDark ? "text-gray-200" : "text-gray-800"}`}
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-500" />
        {t("recentDownloads.title")}
      </h2>

      <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 scrollbar-hide snap-x">
        {recentLectures.map((lecture) => (
          <LatestLectureCard key={lecture._id} lecture={lecture} onClick={onOpenLecture} />
        ))}
      </div>
    </div>
  );
}
