import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Semester } from "../../academic/types";

interface SemesterPickerProps {
  semesters: Semester[];
  isLoading: boolean;
  selectedId: string;
  onSelect: (semesterId: string) => void;
}

export default function SemesterPicker({
  semesters,
  isLoading,
  selectedId,
  onSelect,
}: SemesterPickerProps) {
  const { t } = useTranslation("admin");
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 text-[#404293]" />
        <h2 className="text-sm font-black text-gray-900">
          {t("schedule.semesterHeading")}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-32 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : semesters.length === 0 ? (
        <p className="text-xs font-semibold text-gray-400">
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
                className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? "border-transparent bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md shadow-[#404293]/25"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]"
                }`}
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
