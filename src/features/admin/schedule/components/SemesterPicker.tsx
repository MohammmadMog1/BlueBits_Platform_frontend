import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Semester } from "../../academic/types";
import {
  cardClass,
  headingClass,
  mutedClass,
  segmentButtonClass,
  skeletonClass,
} from "../../../../shared/utils/theme";

interface SemesterPickerProps {
  semesters: Semester[];
  isLoading: boolean;
  selectedId: string;
  onSelect: (semesterId: string) => void;
  isDark: boolean;
}

export default function SemesterPicker({
  semesters,
  isLoading,
  selectedId,
  onSelect,
  isDark,
}: SemesterPickerProps) {
  const { t } = useTranslation("admin");
  return (
    <div className={`p-4 ${cardClass(isDark)}`}>
      <div className="mb-3 flex items-center gap-2">
        <Layers className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
        <h2 className={`text-sm font-black ${headingClass(isDark)}`}>
          {t("schedule.semesterHeading")}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`h-10 w-32 ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : semesters.length === 0 ? (
        <p className={`text-xs font-semibold ${mutedClass(isDark)}`}>
          {t("schedule.noSemesters")}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {semesters.map((semester) => {
            const isActive = semester._id === selectedId;
            return (
              <button
                key={semester._id}
                type="button"
                onClick={() => onSelect(semester._id)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${segmentButtonClass(
                  isDark,
                  isActive,
                )}`}
              >
                {semester.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
