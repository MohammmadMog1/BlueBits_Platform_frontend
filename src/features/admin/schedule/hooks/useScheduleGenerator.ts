import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useGetSemestersQuery, useGetYearsQuery } from "../../academic/api/academicApi";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import {
  useGenerateScheduleDataMutation,
  useGetScheduleConfigQuery,
  useGetScheduleResultQuery,
  usePublishScheduleMutation,
  useSolveScheduleMutation,
} from "../api/scheduleApi";
import { useGetSubjectGroupsBySemesterDetailedQuery } from "../api/subjectGroupsApi";
import type { SubjectYearIndex } from "../types";
import { buildSubjectGroupIndex } from "../utils/schedule";


export function useScheduleGenerator() {
  const { t } = useTranslation("admin");
  const errorMessage = useErrorMessage();
  const [pickedSemesterId, setPickedSemesterId] = useState("");
  const [isConfirmingPublish, setConfirmingPublish] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: semesters = [], isLoading: semestersLoading } =
    useGetSemestersQuery();

  // نفس منطق صفحة الإعدادات: أول فصل مشتق بلا effect
  const selectedSemesterId = pickedSemesterId || semesters[0]?._id || "";

  const configQuery = useGetScheduleConfigQuery(selectedSemesterId, {
    skip: !selectedSemesterId,
  });
  const resultQuery = useGetScheduleResultQuery(selectedSemesterId, {
    skip: !selectedSemesterId,
  });
  /** غروبات المواد الاختيارية لهذا الفصل – لتمييز التداخلات المتوقعة عن التصادمات الفعلية */
  const subjectGroupsQuery = useGetSubjectGroupsBySemesterDetailedQuery(
    selectedSemesterId,
    { skip: !selectedSemesterId },
  );
  const subjectGroupIndex = useMemo(
    () => buildSubjectGroupIndex(subjectGroupsQuery.data ?? []),
    [subjectGroupsQuery.data],
  );

  /** لعرض السنة الدراسية لكل مادة داخل الجدول، إن أمكن معرفتها */
  const subjectsQuery = useGetSubjectsQuery(
    { semesterId: selectedSemesterId },
    { skip: !selectedSemesterId },
  );
  const yearsQuery = useGetYearsQuery();
  const subjectYearIndex = useMemo(() => {
    const yearNameById = new Map(
      (yearsQuery.data ?? []).map((year) => [year._id, year.name]),
    );
    const index: SubjectYearIndex = new Map();
    for (const subject of subjectsQuery.data ?? []) {
      const yearName = yearNameById.get(subject.yearId);
      if (yearName) index.set(subject._id, yearName);
    }
    return index;
  }, [subjectsQuery.data, yearsQuery.data]);

  const [generateData, generateState] = useGenerateScheduleDataMutation();
  const [solve, solveState] = useSolveScheduleMutation();
  const [publish, publishState] = usePublishScheduleMutation();

  const semesterLabel = useMemo(
    () =>
      semesters.find((semester) => semester._id === selectedSemesterId)?.name ??
      "—",
    [semesters, selectedSemesterId],
  );

  /** الجدول الطازج من الـ solver يسبق النتيجة المحفوظة */
  const schedule = solveState.data ?? resultQuery.data ?? null;
  const conflicts = generateState.data?.conflicts ?? [];

  const resetFeedback = () => {
    setSuccessMessage("");
    generateState.reset();
    solveState.reset();
    publishState.reset();
  };

  const selectSemester = (semesterId: string) => {
    setPickedSemesterId(semesterId);
    setConfirmingPublish(false);
    resetFeedback();
  };

  const runGenerateData = async () => {
    if (!selectedSemesterId) return;
    setSuccessMessage("");
    try {
      const data = await generateData(selectedSemesterId).unwrap();
      setSuccessMessage(
        t("schedule.generator.collected", {
          count: data.conflicts?.length ?? 0,
        }),
      );
    } catch {
      // الخطأ معروض عبر generateError
    }
  };

  const runSolve = async () => {
    if (!selectedSemesterId) return;
    const academicYear = configQuery.data?.academicYear;
    if (!academicYear) return;
    setSuccessMessage("");
    try {
      await solve({ semesterId: selectedSemesterId, academicYear }).unwrap();
      setSuccessMessage(t("schedule.generator.generated"));
    } catch {
      // الخطأ معروض عبر solveError
    }
  };

  const confirmPublish = async () => {
    if (!selectedSemesterId) return;
    try {
      await publish(selectedSemesterId).unwrap();
      setConfirmingPublish(false);
      setSuccessMessage(t("schedule.generator.published"));
    } catch {
      // الخطأ معروض في نافذة التأكيد
    }
  };

  return {
    // البيانات
    semesters,
    semestersLoading,
    selectedSemesterId,
    semesterLabel,
    config: configQuery.data ?? null,
    configLoading: configQuery.isLoading,
    conflicts,
    hasGeneratedData: Boolean(generateState.data),
    schedule,
    resultLoading: resultQuery.isLoading,
    /** يشمل جلب آخر جدول محفوظ وتشغيل الـ solver معاً – لعرض لودينغ موحّد فوق الجدول */
    isScheduleLoading: resultQuery.isLoading || solveState.isLoading,
    subjectGroupIndex,
    subjectGroupsLoading: subjectGroupsQuery.isLoading,
    subjectYearIndex,

    // الحالة
    isGenerating: generateState.isLoading,
    isSolving: solveState.isLoading,
    isPublishing: publishState.isLoading,
    generateError: generateState.error ? errorMessage(generateState.error) : "",
    solveError: solveState.error ? errorMessage(solveState.error) : "",
    publishError: publishState.error ? errorMessage(publishState.error) : "",
    resultError: resultQuery.isError ? errorMessage(resultQuery.error) : "",
    successMessage,
    isConfirmingPublish,

    // الإجراءات
    selectSemester,
    runGenerateData,
    runSolve,
    askPublish: () => setConfirmingPublish(true),
    cancelPublish: () => setConfirmingPublish(false),
    confirmPublish,
    dismissSuccess: () => setSuccessMessage(""),
  };
}
