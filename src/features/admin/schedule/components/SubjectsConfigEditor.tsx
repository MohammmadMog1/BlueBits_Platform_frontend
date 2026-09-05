import { useMemo, useState } from "react";
import {
  AlertCircle,
  BookMarked,
  ChevronDown,
  Layers,
  ListPlus,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import type { Subject } from "../../subjects/types";
import type { SubjectConfigRow, SubjectGroup } from "../types";
import { buildSubjectGroupIndex, createSubjectRow } from "../utils/schedule";
import { emptyBoxClass, headingClass, mutedClass, skeletonClass } from "../../../../shared/utils/theme";

interface SubjectsConfigEditorProps {
  rows: SubjectConfigRow[];
  subjects: Subject[];
  isLoading: boolean;
  onChange: (rows: SubjectConfigRow[]) => void;
  isDark: boolean;
  /** غروبات المواد الاختيارية لهذا الفصل – لإضافة كل مواد الغروب دفعة واحدة */
  subjectGroups?: SubjectGroup[];
}

export default function SubjectsConfigEditor({
  rows,
  subjects,
  isLoading,
  onChange,
  isDark,
  subjectGroups = [],
}: SubjectsConfigEditorProps) {
  const { t } = useTranslation("admin");
  const [search, setSearch] = useState("");
  const usedIds = new Set(rows.map((row) => row.subjectId).filter(Boolean));
  const remaining = subjects.filter((subject) => !usedIds.has(subject._id));
  const groupIndex = useMemo(() => buildSubjectGroupIndex(subjectGroups), [subjectGroups]);
  const subjectsById = useMemo(
    () => new Map(subjects.map((subject) => [subject._id, subject])),
    [subjects],
  );

  const updateRow = (key: string, patch: Partial<SubjectConfigRow>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const removeRow = (key: string) =>
    onChange(rows.filter((row) => row.key !== key));

  const addRow = () => onChange([...rows, createSubjectRow()]);

  /** إضافة كل المواد المتبقية دفعة واحدة – الفصل قد يحوي عشرات المواد */
  const addAllRemaining = () =>
    onChange([
      ...rows,
      ...remaining.map((subject) => createSubjectRow({ subjectId: subject._id })),
    ]);

  /** إضافة كل مواد غروب اختياري دفعة واحدة – مواد الغروب تتشارك نفس الفترة الامتحانية */
  const addGroup = (group: SubjectGroup) => {
    const newRows = (group.subjects ?? [])
      .filter((subject) => !usedIds.has(subject._id))
      .map((subject) => createSubjectRow({ subjectId: subject._id }));
    if (newRows.length > 0) onChange([...rows, ...newRows]);
  };

  const query = search.trim().toLowerCase();
  const visibleRows = query
    ? rows.filter((row) => {
        const name = row.subjectId ? subjectsById.get(row.subjectId)?.name : undefined;
        return !name || name.toLowerCase().includes(query);
      })
    : rows;

  const selectClass = `min-w-0 flex-1 appearance-none truncate rounded-md border border-transparent bg-transparent py-1 ps-1.5 pe-5 text-[12px] font-bold outline-none transition-colors hover:bg-black/[0.03] focus:border-[#2376BB] focus:bg-transparent focus:ring-1 focus:ring-[#2376BB]/25 dark:hover:bg-white/[0.06] ${
    isDark ? "text-gray-100" : "text-gray-800"
  }`;
  const numberClass = `w-full appearance-none rounded-md border py-1 text-center text-[11px] font-bold outline-none transition-colors focus:border-[#2376BB] focus:ring-1 focus:ring-[#2376BB]/25 ${
    isDark ? "border-white/10 bg-white/5 text-gray-100" : "border-gray-200 bg-gray-50 text-gray-800"
  }`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#2376BB]/10 text-[#2376BB]"
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
          </div>
          <h3 className={`text-sm font-black ${headingClass(isDark)}`}>
            {t("schedule.subjectsEditor.title")}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
              isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"
            }`}
          >
            {rows.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {remaining.length > 0 && (
            <button
              type="button"
              onClick={addAllRemaining}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                isDark
                  ? "border-white/10 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
                  : "border-gray-200 text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]"
              }`}
            >
              <ListPlus size={14} />{" "}
              {t("schedule.subjectsEditor.addAll", { count: remaining.length })}
            </button>
          )}
          <button
            type="button"
            onClick={addRow}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              isDark
                ? "bg-[#2376BB]/15 text-[#7fb5e4] hover:bg-[#2376BB]/25"
                : "bg-[#404293]/10 text-[#404293] hover:bg-[#404293]/20"
            }`}
          >
            <Plus size={14} /> {t("schedule.subjectsEditor.addSubject")}
          </button>
        </div>
      </div>

      {subjectGroups.length > 0 && (
        <div className={`rounded-2xl border p-3 ${isDark ? "border-[#2376BB]/20 bg-[#2376BB]/[0.06]" : "border-[#404293]/15 bg-[#404293]/[0.04]"}`}>
          <div className="mb-2 flex items-center gap-1.5">
            <Layers className={`h-3.5 w-3.5 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
            <p className={`text-xs font-black ${headingClass(isDark)}`}>
              {t("schedule.subjectsEditor.groupsTitle")}
            </p>
          </div>
          <p className={`mb-2.5 text-[11px] font-semibold ${mutedClass(isDark)}`}>
            {t("schedule.subjectsEditor.groupsHint")}
          </p>
          <div className="flex flex-wrap gap-2">
            {subjectGroups.map((group) => {
              const groupSubjects = group.subjects ?? [];
              const remainingInGroup = groupSubjects.filter(
                (subject) => !usedIds.has(subject._id),
              );
              return (
                <button
                  key={group._id}
                  type="button"
                  onClick={() => addGroup(group)}
                  disabled={remainingInGroup.length === 0}
                  title={groupSubjects.map((subject) => subject.name).join("، ")}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDark
                      ? "border-white/10 bg-white/5 text-gray-300 hover:border-[#2376BB]/40 hover:text-[#7fb5e4]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#404293]/30 hover:text-[#404293]"
                  }`}
                >
                  <ListPlus size={12} />
                  {group.name}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      isDark ? "bg-white/10" : "bg-gray-100"
                    }`}
                  >
                    {remainingInGroup.length}/{groupSubjects.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`h-14 ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className={`flex flex-col items-center gap-2 py-10 text-center ${emptyBoxClass(isDark)}`}>
          <BookMarked className={`h-6 w-6 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-sm font-bold ${mutedClass(isDark)}`}>
            {t("schedule.subjectsEditor.empty")}
          </p>
          <p className={`text-xs ${mutedClass(isDark)}`}>
            {t("schedule.subjectsEditor.emptyHint")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.length > 6 && (
            <div className="relative">
              <Search
                className={`pointer-events-none absolute start-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${mutedClass(isDark)}`}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("schedule.subjectsEditor.searchPlaceholder")}
                className={`w-full rounded-full border py-2 ps-9 pe-8 text-xs font-semibold outline-none transition-all focus:ring-2 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-500 focus:border-[#2376BB]/60 focus:ring-[#2376BB]/15"
                    : "border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-[#2376BB]/40 focus:bg-white focus:ring-[#2376BB]/10"
                }`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label={t("schedule.subjectsEditor.clearSearch")}
                  className={`absolute end-3 top-1/2 -translate-y-1/2 transition-colors ${
                    isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          {visibleRows.length === 0 ? (
            <p className={`py-4 text-center text-xs font-semibold ${mutedClass(isDark)}`}>
              {t("schedule.subjectsEditor.noSearchMatches")}
            </p>
          ) : (
            <div className="max-h-[30rem] overflow-y-auto p-0.5">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence initial={false}>
                  {visibleRows.map((row) => {
                    const isUnknown =
                      Boolean(row.subjectId) &&
                      !subjects.some((subject) => subject._id === row.subjectId);
                    const isDuplicate =
                      Boolean(row.subjectId) &&
                      rows.filter((item) => item.subjectId === row.subjectId).length > 1;
                    const membership = groupIndex.get(row.subjectId);
                    const warningTitle = isDuplicate
                      ? t("schedule.subjectsEditor.duplicateWarning")
                      : isUnknown
                        ? t("schedule.subjectsEditor.notInSemesterWarning")
                        : undefined;

                    return (
                      <motion.div
                        key={row.key}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className={`group rounded-xl border p-2 transition-all hover:shadow-sm ${
                          isDuplicate
                            ? isDark
                              ? "border-red-500/30 bg-red-500/10"
                              : "border-red-200 bg-red-50"
                            : isDark
                              ? "border-white/10 bg-white/[0.03] hover:border-white/20"
                              : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <div className="relative min-w-0 flex-1">
                            <select
                              value={row.subjectId}
                              onChange={(event) =>
                                updateRow(row.key, { subjectId: event.target.value })
                              }
                              className={selectClass}
                            >
                              <option value="">{t("schedule.subjectsEditor.chooseSubject")}</option>
                              {isUnknown && (
                                <option value={row.subjectId}>
                                  {t("schedule.subjectsEditor.unknownSubject", {
                                    id: row.subjectId.slice(0, 8),
                                  })}
                                </option>
                              )}
                              {subjects.map((subject) => (
                                <option
                                  key={subject._id}
                                  value={subject._id}
                                  disabled={
                                    usedIds.has(subject._id) && subject._id !== row.subjectId
                                  }
                                >
                                  {subject.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={11}
                              className={`pointer-events-none absolute end-1 top-1/2 -translate-y-1/2 ${
                                isDark ? "text-gray-600" : "text-gray-300"
                              }`}
                            />
                          </div>

                          {membership && (
                            <span
                              className="shrink-0"
                              title={t("schedule.subjectsEditor.groupBadge", {
                                group: membership.groupName,
                              })}
                            >
                              <Layers
                                size={12}
                                className={isDark ? "text-[#7fb5e4]" : "text-[#404293]"}
                              />
                            </span>
                          )}
                          {warningTitle && (
                            <span className="shrink-0" title={warningTitle}>
                              <AlertCircle
                                size={12}
                                className={isDark ? "text-amber-400" : "text-amber-600"}
                              />
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeRow(row.key)}
                            aria-label={t("schedule.subjectsEditor.removeSubject")}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100 ${
                              isDark
                                ? "text-gray-600 hover:bg-red-500/10 hover:text-red-400"
                                : "text-gray-300 hover:bg-red-50 hover:text-red-500"
                            }`}
                          >
                            <X size={12} />
                          </button>
                        </div>

                        <div className="mt-1.5 flex items-center gap-1.5">
                          <div className="relative flex-1">
                            <input
                              type="number"
                              min={0}
                              value={row.carriedStudentsCount}
                              onChange={(event) =>
                                updateRow(row.key, { carriedStudentsCount: event.target.value })
                              }
                              title={t("schedule.subjectsEditor.carriedTitle")}
                              className={numberClass}
                            />
                            <span
                              className={`pointer-events-none absolute -top-1.5 start-1.5 px-0.5 text-[8px] font-black leading-none ${
                                isDark ? "bg-[#202121] text-gray-500" : "bg-white text-gray-400"
                              }`}
                            >
                              {t("schedule.subjectsEditor.carriedShort")}
                            </span>
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              min={1}
                              step={5}
                              value={row.examDurationOverride}
                              onChange={(event) =>
                                updateRow(row.key, { examDurationOverride: event.target.value })
                              }
                              title={t("schedule.subjectsEditor.durationTitle")}
                              className={numberClass}
                            />
                            <span
                              className={`pointer-events-none absolute -top-1.5 start-1.5 px-0.5 text-[8px] font-black leading-none ${
                                isDark ? "bg-[#202121] text-gray-500" : "bg-white text-gray-400"
                              }`}
                            >
                              {t("schedule.subjectsEditor.durationShort")}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
