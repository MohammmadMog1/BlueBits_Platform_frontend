import { useMemo, useState } from "react";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useGetYearsQuery } from "../../academic/api/academicApi";
import {
  useGetSubjectsStatsAllYearsQuery,
  useGetSubjectsStatsByYearQuery,
  useGetSurveyFormsQuery,
} from "../api/surveysApi";
import type { StatsScope, SubjectStatsSortKey, YearStats } from "../types";
import { getRefId, sortSubjectStats } from "../utils/survey";

/**
 * إحصاءات الاستبيان: سنة واحدة (مع إمكانية تقييدها بفورم معيّن)
 * أو كل السنوات دفعة واحدة.
 */
export function useSurveyStats() {
  const errorMessage = useErrorMessage();
  const [scope, setScope] = useState<StatsScope>("year");
  const [pickedYearId, setPickedYearId] = useState("");
  const [formId, setFormId] = useState("");
  const [sortKey, setSortKey] = useState<SubjectStatsSortKey>("difficulty");
  const [search, setSearch] = useState("");

  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
  const { data: forms = [] } = useGetSurveyFormsQuery();

  // أول سنة مشتقة بلا effect – نفس نمط صفحات الجدولة
  const selectedYearId = pickedYearId || years[0]?._id || "";

  const yearQuery = useGetSubjectsStatsByYearQuery(
    { yearId: selectedYearId, formId: formId || undefined },
    { skip: scope !== "year" || !selectedYearId },
  );
  const allYearsQuery = useGetSubjectsStatsAllYearsQuery(undefined, {
    skip: scope !== "all",
  });

  /** فورمات السنة المختارة – لعرض إحصاءات فورم سابق بدل الحالي */
  const yearForms = useMemo(
    () =>
      forms
        .filter((form) => getRefId(form.yearId) === selectedYearId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [forms, selectedYearId],
  );

  const yearNameById = useMemo(
    () => new Map(years.map((year) => [year._id, year.name])),
    [years],
  );

  /** نوحّد الحالتين في قائمة واحدة ليعرضها نفس المكوّن */
  const blocks = useMemo<YearStats[]>(() => {
    const source =
      scope === "year"
        ? yearQuery.data
          ? [yearQuery.data]
          : []
        : (allYearsQuery.data ?? []);

    const term = search.trim().toLowerCase();

    return source.map((block) => ({
      ...block,
      yearName: block.yearName ?? yearNameById.get(block.yearId) ?? "—",
      subjects: sortSubjectStats(
        term
          ? block.subjects.filter((subject) =>
              subject.subjectName.toLowerCase().includes(term),
            )
          : block.subjects,
        sortKey,
      ),
    }));
  }, [
    scope,
    yearQuery.data,
    allYearsQuery.data,
    search,
    sortKey,
    yearNameById,
  ]);

  const isLoading =
    scope === "year"
      ? yearQuery.isLoading || yearsLoading
      : allYearsQuery.isLoading;
  const isFetching =
    scope === "year" ? yearQuery.isFetching : allYearsQuery.isFetching;

  const error =
    scope === "year"
      ? yearQuery.isError
        ? errorMessage(yearQuery.error)
        : ""
      : allYearsQuery.isError
        ? errorMessage(allYearsQuery.error)
        : "";

  /** 404 من الباك يعني "ما في فورم لهي السنة" – حالة فارغة لا خطأ */
  const isYearEmpty =
    scope === "year" &&
    !yearQuery.isFetching &&
    !yearQuery.isError &&
    yearQuery.data === null;

  const selectScope = (next: StatsScope) => {
    setScope(next);
    setSearch("");
  };

  const selectYear = (yearId: string) => {
    setPickedYearId(yearId);
    setFormId("");
  };

  return {
    // البيانات
    years,
    yearForms,
    blocks,

    // الحالة
    scope,
    selectedYearId,
    formId,
    sortKey,
    search,
    yearsLoading,
    isLoading,
    isFetching,
    error,
    isYearEmpty,

    // الإجراءات
    selectScope,
    selectYear,
    setFormId,
    setSortKey,
    setSearch,
    refetch: () => {
      if (scope === "year") void yearQuery.refetch();
      else void allYearsQuery.refetch();
    },
  };
}
