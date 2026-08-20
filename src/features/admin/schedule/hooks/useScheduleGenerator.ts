import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useGetSemestersQuery } from "../../academic/api/academicApi";
import {
  useGenerateScheduleDataMutation,
  useGetScheduleConfigQuery,
  useGetScheduleResultQuery,
  usePublishScheduleMutation,
  useSolveScheduleMutation,
} from "../api/scheduleApi";


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
    setSuccessMessage("");
    try {
      await solve(selectedSemesterId).unwrap();
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
