import { useState } from "react";
import { Check, Layers, Pencil, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Subject } from "../../subjects/types";
import type { SubjectGroup } from "../types";
import { cardClass, fieldClass, headingClass, mutedClass } from "../../../../shared/utils/theme";

interface SubjectGroupCardProps {
  group: SubjectGroup;
  /** مواد الفصل غير المنضمّة لأي غروب بعد – هي فقط ما يمكن إضافته هنا */
  availableSubjects: Subject[];
  onRename: (name: string) => void;
  onDelete: () => void;
  onAddSubject: (subjectId: string) => void;
  onRemoveSubject: (subjectId: string) => void;
  isDark: boolean;
}

export default function SubjectGroupCard({
  group,
  availableSubjects,
  onRename,
  onDelete,
  onAddSubject,
  onRemoveSubject,
  isDark,
}: SubjectGroupCardProps) {
  const { t } = useTranslation(["admin", "common"]);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(group.name);
  const [pickedSubjectId, setPickedSubjectId] = useState("");

  const subjects = group.subjects ?? [];

  const startRename = () => {
    setNameDraft(group.name);
    setIsRenaming(true);
  };

  const saveRename = () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== group.name) onRename(trimmed);
    setIsRenaming(false);
  };

  const handleAddSubject = () => {
    if (!pickedSubjectId) return;
    onAddSubject(pickedSubjectId);
    setPickedSubjectId("");
  };

  return (
    <div className={`space-y-3 p-4 ${cardClass(isDark)}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#404293]/10 text-[#404293]"
            }`}
          >
            <Layers className="h-4 w-4" />
          </div>
          {isRenaming ? (
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <input
                autoFocus
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveRename();
                  if (event.key === "Escape") setIsRenaming(false);
                }}
                className={`py-1.5 text-sm ${fieldClass(isDark)}`}
              />
              <button
                type="button"
                onClick={saveRename}
                aria-label={t("common:actions.save")}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <Check size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsRenaming(false)}
                aria-label={t("common:actions.cancel")}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-500"
                }`}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="min-w-0">
              <p className={`truncate text-sm font-black ${headingClass(isDark)}`}>{group.name}</p>
              <p className={`text-[11px] font-bold ${mutedClass(isDark)}`}>
                {t("schedule.groups.subjectsCount", { count: subjects.length })}
              </p>
            </div>
          )}
        </div>

        {!isRenaming && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={startRename}
              aria-label={t("schedule.groups.renameGroup")}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                isDark
                  ? "border-white/10 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#7fb5e4]"
                  : "border-gray-200 text-gray-400 hover:border-[#404293]/30 hover:text-[#404293]"
              }`}
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={t("schedule.groups.deleteGroup")}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                isDark
                  ? "border-white/10 text-gray-400 hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-400"
                  : "border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {subjects.map((subject) => (
            <span
              key={subject._id}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                isDark ? "border-white/10 bg-white/5 text-gray-300" : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {subject.name}
              <button
                type="button"
                onClick={() => onRemoveSubject(subject._id)}
                aria-label={t("schedule.groups.removeSubject")}
                className={`transition-colors ${
                  isDark ? "text-gray-600 hover:text-red-400" : "text-gray-300 hover:text-red-500"
                }`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <select
          value={pickedSubjectId}
          onChange={(event) => setPickedSubjectId(event.target.value)}
          disabled={availableSubjects.length === 0}
          className={`flex-1 py-2 text-xs disabled:opacity-50 ${fieldClass(isDark)}`}
        >
          <option value="">
            {availableSubjects.length === 0
              ? t("schedule.groups.noRemainingSubjects")
              : t("schedule.groups.addSubjectPlaceholder")}
          </option>
          {availableSubjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddSubject}
          disabled={!pickedSubjectId}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-40 ${
            isDark
              ? "bg-[#2376BB]/15 text-[#7fb5e4] hover:bg-[#2376BB]/25"
              : "bg-[#404293]/10 text-[#404293] hover:bg-[#404293]/20"
          }`}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
