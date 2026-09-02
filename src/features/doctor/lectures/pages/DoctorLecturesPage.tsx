import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  BookOpen,
  FolderOpen,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import {
  accentIconClass,
  cardClass,
  emptyBoxClass,
  errorAlertClass,
  faintClass,
  fieldClass,
  headingClass,
  iconButtonClass,
  mutedClass,
} from "../../../../shared/utils/theme";
import { useGetMySubjectsQuery } from "../../../admin/subjects/api/subjectsApi";
import { useDeleteLectureMutation, useGetMyLecturesQuery, useUpdateLectureMutation } from "../../api/doctorApi";
import { DoctorLectureFormModal } from "../components/DoctorLectureFormModal";
import DoctorLectureCard from "../components/DoctorLectureCard";
import type { LecturePopulated, LectureType } from "../../../admin/lectures/types";

export default function DoctorLecturesPage() {
  const { t } = useTranslation(["doctor", "common"]);
  const errorMessage = useErrorMessage();
  const isDark = useIsDark();

  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState<LectureType | "">("");
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LecturePopulated | null>(null);
  const [deletingLecture, setDeletingLecture] = useState<LecturePopulated | null>(null);

  const lecturesQuery = useGetMyLecturesQuery();
  const { data: subjects = [] } = useGetMySubjectsQuery();
  const [deleteLecture, deleteState] = useDeleteLectureMutation();
  const [updateLecture] = useUpdateLectureMutation();

  const lectures = useMemo(() => lecturesQuery.data ?? [], [lecturesQuery.data]);

  const filteredLectures = useMemo(() => {
    const term = search.trim().toLowerCase();
    return lectures.filter((lecture) => {
      const matchesSearch = !term || lecture.title.toLowerCase().includes(term);
      const matchesSubject = !filterSubject || lecture.subjectId?._id === filterSubject;
      const matchesType = !filterType || lecture.type === filterType;
      return matchesSearch && matchesSubject && matchesType;
    });
  }, [lectures, search, filterSubject, filterType]);

  const stats = useMemo(() => {
    const published = lectures.filter((lecture) => lecture.isPublished).length;
    return [
      { label: t("doctor:lectures.stats.totalLectures"), value: lectures.length, color: "#404293" },
      { label: t("doctor:lectures.stats.published"), value: published, color: "#059669" },
      { label: t("doctor:lectures.stats.draft"), value: lectures.length - published, color: "#F59E0B" },
      { label: t("doctor:lectures.stats.subjects"), value: subjects.length, color: "#2376BB" },
    ];
  }, [lectures, subjects, t]);

  const handleDelete = async () => {
    if (!deletingLecture) return;
    try {
      await deleteLecture(deletingLecture._id).unwrap();
      setDeletingLecture(null);
    } catch {
      return;
    }
  };

  const handleToggleStatus = async (lecture: LecturePopulated) => {
    await updateLecture({ id: lecture._id, data: { isPublished: !lecture.isPublished } })
      .unwrap()
      .catch(() => undefined);
  };

  const canUpload = subjects.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
              <BookOpen className="h-[18px] w-[18px] text-white" />
            </div>
            <h1 className={`text-xl font-black tracking-tight ${headingClass(isDark)}`}>
              {t("doctor:lectures.title")}
            </h1>
          </div>
          <p className={`text-sm font-medium ${mutedClass(isDark)}`}>{t("doctor:lectures.subtitle")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => lecturesQuery.refetch()}
            title={t("common:actions.refresh")}
            aria-label={t("common:actions.refresh")}
            className={iconButtonClass(isDark)}
          >
            <RefreshCcw className={`h-4 w-4 ${lecturesQuery.isFetching ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={!canUpload}
            title={canUpload ? undefined : t("doctor:lectures.empty.noSubjectsMessage")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-[#404293]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#404293]/45 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} /> {t("doctor:lectures.uploadLecture")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`flex items-center gap-3 px-4 py-3.5 transition-shadow hover:shadow-md ${cardClass(isDark)}`}>
            <div
              className="h-8 w-1.5 shrink-0 rounded-full"
              style={{ background: `linear-gradient(180deg,${stat.color},${stat.color}55)` }}
            />
            <div>
              <p className={`text-lg font-black leading-none ${headingClass(isDark)}`}>{stat.value}</p>
              <p className={`mt-0.5 text-[11px] font-semibold ${mutedClass(isDark)}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`flex flex-wrap items-center gap-3 p-4 ${cardClass(isDark)}`}>
        <div
          className={`flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
            isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
          }`}
        >
          <Search className={`h-4 w-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("doctor:lectures.searchPlaceholder")}
            className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${isDark ? "text-gray-200" : "text-gray-700"}`}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}>
              <X size={13} className="text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        <select
          value={filterSubject}
          onChange={(event) => setFilterSubject(event.target.value)}
          className={`${fieldClass(isDark)} w-auto`}
        >
          <option value="">{t("doctor:lectures.allSubjects")}</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(event) => setFilterType(event.target.value as LectureType | "")}
          className={`${fieldClass(isDark)} w-auto`}
        >
          <option value="">{t("doctor:lectures.allTypes")}</option>
          <option value="theoretical">{t("doctor:lectures.types.theoretical")}</option>
          <option value="practical">{t("doctor:lectures.types.practical")}</option>
        </select>
        {(filterSubject || filterType || search) && (
          <button
            type="button"
            onClick={() => {
              setFilterSubject("");
              setFilterType("");
              setSearch("");
            }}
            className={`flex items-center gap-1.5 rounded-xl border border-transparent px-3.5 py-2.5 text-xs font-bold transition-colors ${
              isDark ? "text-red-400 hover:border-red-500/20 hover:bg-red-500/10" : "text-red-500 hover:border-red-100 hover:bg-red-50"
            }`}
          >
            <X size={13} /> {t("doctor:lectures.clearFilters")}
          </button>
        )}
      </div>

      {lecturesQuery.isError && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className={errorAlertClass(isDark)}>
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage(lecturesQuery.error)}
        </motion.div>
      )}

      {lecturesQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`h-28 w-full animate-pulse rounded-2xl ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
          ))}
        </div>
      ) : filteredLectures.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-24 text-center ${emptyBoxClass(isDark)}`}>
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            <FolderOpen className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          </div>
          <p className={`mb-1 font-bold ${mutedClass(isDark)}`}>
            {t(
              !canUpload
                ? "doctor:lectures.empty.noSubjectsTitle"
                : search || filterSubject || filterType
                  ? "doctor:lectures.empty.noMatches"
                  : "doctor:lectures.empty.noLecturesTitle",
            )}
          </p>
          <p className={`mb-4 text-sm ${faintClass(isDark)}`}>
            {t(
              !canUpload
                ? "doctor:lectures.empty.noSubjectsMessage"
                : search || filterSubject || filterType
                  ? "doctor:lectures.searchPlaceholder"
                  : "doctor:lectures.empty.uploadFirst",
            )}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filteredLectures.map((lecture) => (
              <DoctorLectureCard
                key={lecture._id}
                lecture={lecture}
                isDark={isDark}
                onEdit={() => setEditingLecture(lecture)}
                onDelete={() => setDeletingLecture(lecture)}
                onToggleStatus={() => handleToggleStatus(lecture)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {(showForm || editingLecture) && (
          <DoctorLectureFormModal
            isDark={isDark}
            subjects={subjects}
            defaultSubjectId={filterSubject || undefined}
            lecture={editingLecture}
            onClose={() => {
              setShowForm(false);
              setEditingLecture(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingLecture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            onClick={() => !deleteState.isLoading && setDeletingLecture(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl ${
                isDark ? "border border-white/10 bg-[#1a1b1e]" : "border border-gray-200 bg-white"
              }`}
            >
              <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${accentIconClass(isDark, "rose")}`}>
                <Trash2 className="h-7 w-7" />
              </div>
              <h3 className={`mb-2 text-lg font-black ${headingClass(isDark)}`}>{t("doctor:lectures.confirmDelete.title")}</h3>
              <p className={`mb-1 text-sm ${mutedClass(isDark)}`}>{t("doctor:lectures.confirmDelete.body")}</p>
              <p className={`mb-6 text-sm font-black ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}>
                "{deletingLecture.title}"
              </p>
              <p className={`mb-6 text-xs ${faintClass(isDark)}`}>{t("doctor:lectures.confirmDelete.irreversible")}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingLecture(null)}
                  disabled={deleteState.isLoading}
                  className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-colors disabled:opacity-50 ${
                    isDark ? "border-white/15 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t("common:actions.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteState.isLoading}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-red-600 disabled:opacity-60 ${
                    isDark ? "shadow-red-950/40" : "shadow-red-200"
                  }`}
                >
                  {deleteState.isLoading ? t("doctor:lectures.confirmDelete.working") : t("doctor:lectures.confirmDelete.yes")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
