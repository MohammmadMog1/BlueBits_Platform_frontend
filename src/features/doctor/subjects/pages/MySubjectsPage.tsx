import { useState } from "react";
import { AlertCircle, BookMarked, RefreshCcw, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import {
  emptyBoxClass,
  errorAlertClass,
  headingClass,
  iconButtonClass,
  mutedClass,
} from "../../../../shared/utils/theme";
import { useGetMySubjectsQuery } from "../../../admin/subjects/api/subjectsApi";
import { useGetMyStatsQuery } from "../../api/doctorApi";
import MySubjectCard from "../components/MySubjectCard";

export default function MySubjectsPage() {
  const { t } = useTranslation(["doctor", "common"]);
  const errorMessage = useErrorMessage();
  const isDark = useIsDark();
  const [search, setSearch] = useState("");

  const subjectsQuery = useGetMySubjectsQuery();
  const { data: stats = [] } = useGetMyStatsQuery();

  const subjects = subjectsQuery.data ?? [];
  const filteredSubjects = subjects.filter((subject) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      subject.name.toLowerCase().includes(term) ||
      (subject.description ?? "").toLowerCase().includes(term)
    );
  });

  const statsBySubjectId = new Map(stats.map((item) => [item.subjectId, item]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
              <BookMarked className="h-[18px] w-[18px] text-white" />
            </div>
            <h1 className={`text-xl font-black tracking-tight ${headingClass(isDark)}`}>
              {t("doctor:subjects.title")}
            </h1>
          </div>
          <p className={`text-sm font-medium ${mutedClass(isDark)}`}>
            {t("doctor:subjects.subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => subjectsQuery.refetch()}
          title={t("common:actions.refresh")}
          aria-label={t("common:actions.refresh")}
          className={iconButtonClass(isDark)}
        >
          <RefreshCcw className={`h-4 w-4 ${subjectsQuery.isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div
        className={`flex min-w-[180px] items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
        }`}
      >
        <Search className={`h-4 w-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("doctor:subjects.searchPlaceholder")}
          className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label={t("doctor:subjects.clearSearch")}
          >
            <X size={13} className="text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>

      {subjectsQuery.isError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={errorAlertClass(isDark)}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage(subjectsQuery.error)}
        </motion.div>
      )}

      {subjectsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`animate-pulse rounded-2xl border p-5 ${
                isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
              }`}
            >
              <div className={`mb-5 h-1 w-full rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`mb-3 h-4 w-3/4 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`mb-2 h-3 w-full rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`h-3 w-2/3 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
            </div>
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center py-24 text-center ${emptyBoxClass(isDark)}`}
        >
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            <BookMarked className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          </div>
          <p className={`mb-1 font-bold ${mutedClass(isDark)}`}>
            {t(search ? "doctor:subjects.emptyNoResults" : "doctor:subjects.emptyNone")}
          </p>
          <p className={`text-sm ${mutedClass(isDark)}`}>
            {t(search ? "doctor:subjects.emptySearchHint" : "doctor:subjects.emptyHint")}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject) => (
              <MySubjectCard
                key={subject._id}
                subject={subject}
                stats={statsBySubjectId.get(subject._id)}
                isDark={isDark}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
