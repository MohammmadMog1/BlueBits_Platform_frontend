import { useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import BottomSheetModal from "../../../../shared/components/BottomSheetModal/BottomSheetModal";
import { LatestLectureCard } from "./LatestLectureCard";
import type { LecturePopulated } from "../types";

interface AllLecturesModalProps {
  lectures: LecturePopulated[];
  isDark: boolean;
  onClose: () => void;
  onOpenLecture: (lecture: LecturePopulated) => void;
}

/** نافذة "عرض الكل" لأحدث المحاضرات — شبكة مربّعات بدل التمرير الأفقي، مع بحث سريع */
export function AllLecturesModal({
  lectures,
  isDark,
  onClose,
  onOpenLecture,
}: AllLecturesModalProps) {
  const { t } = useTranslation("lectures");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return lectures;
    return lectures.filter(
      (lecture) =>
        lecture.title.toLowerCase().includes(query) ||
        lecture.subjectId?.name?.toLowerCase().includes(query),
    );
  }, [lectures, search]);

  return (
    <BottomSheetModal
      onClose={onClose}
      icon={<Sparkles className="h-5 w-5 text-white" />}
      title={t("latest.title")}
      subtitle={t("totalCount", { count: lectures.length })}
      isDark={isDark}
      maxWidthClassName="sm:max-w-3xl"
    >
      <div
        className={`mb-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
        }`}
      >
        <Search className={`h-4 w-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className={`w-full bg-transparent text-sm outline-none ${
            isDark ? "text-gray-200 placeholder-gray-500" : "text-gray-700 placeholder-gray-400"
          }`}
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} aria-label={t("clearSearch")}>
            <X
              size={14}
              className={isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-300 hover:text-gray-500"}
            />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className={`py-10 text-center text-sm font-semibold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {t("empty.noMatches")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {filtered.map((lecture) => (
            <LatestLectureCard
              key={lecture._id}
              lecture={lecture}
              variant="grid"
              onClick={(selected) => {
                onOpenLecture(selected);
                onClose();
              }}
            />
          ))}
        </div>
      )}
    </BottomSheetModal>
  );
}
