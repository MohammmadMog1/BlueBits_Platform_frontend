import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useGetSemestersQuery } from "../../academic/api/academicApi";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import {
  useCreateScheduleConfigMutation,
  useDeleteScheduleConfigMutation,
  useGetScheduleConfigQuery,
  useUpdateScheduleConfigMutation,
} from "../api/scheduleApi";
import { useGetSubjectGroupsBySemesterDetailedQuery } from "../api/subjectGroupsApi";
import type { ScheduleConfigFormValues } from "../types";


export type ScheduleConfigMode = "view" | "create" | "edit";

export function useScheduleConfigManager() {
  const { t } = useTranslation("admin");
  const errorMessage = useErrorMessage();
  const [pickedSemesterId, setPickedSemesterId] = useState("");
  const [mode, setMode] = useState<ScheduleConfigMode>("view");
  const [isConfirmingDelete, setConfirmingDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: semesters = [], isLoading: semestersLoading } =
    useGetSemestersQuery();

  // أول فصل يُختار تلقائياً حتى لا تبدأ الصفحة فارغة (مشتق، بلا effect)
  const selectedSemesterId = pickedSemesterId || semesters[0]?._id || "";

  const configQuery = useGetScheduleConfigQuery(selectedSemesterId, {
    skip: !selectedSemesterId,
  });
  const subjectsQuery = useGetSubjectsQuery(
    { semesterId: selectedSemesterId },
    { skip: !selectedSemesterId },
  );
  /** غروبات المواد الاختيارية لهذا الفصل – لإضافة كل مواد الغروب دفعة واحدة */
  const subjectGroupsQuery = useGetSubjectGroupsBySemesterDetailedQuery(
    selectedSemesterId,
    { skip: !selectedSemesterId },
  );

  const [createConfig, createState] = useCreateScheduleConfigMutation();
  const [updateConfig, updateState] = useUpdateScheduleConfigMutation();
  const [deleteConfig, deleteState] = useDeleteScheduleConfigMutation();

  const config = configQuery.data ?? null;
  const semesterLabel = useMemo(
    () =>
      semesters.find((semester) => semester._id === selectedSemesterId)?.name ??
      "—",
    [semesters, selectedSemesterId],
  );

  const isSubmitting = createState.isLoading || updateState.isLoading;
  const submitError = createState.error
    ? errorMessage(createState.error)
    : updateState.error
      ? errorMessage(updateState.error)
      : undefined;

  const resetFeedback = () => {
    setSuccessMessage("");
    createState.reset();
    updateState.reset();
    deleteState.reset();
  };

  const selectSemester = (semesterId: string) => {
    setPickedSemesterId(semesterId);
    setMode("view");
    setConfirmingDelete(false);
    resetFeedback();
  };

  const startCreate = () => {
    resetFeedback();
    setMode("create");
  };

  const startEdit = () => {
    resetFeedback();
    setMode("edit");
  };

  const cancelForm = () => {
    resetFeedback();
    setMode("view");
  };

  const submit = async (values: ScheduleConfigFormValues) => {
    if (!selectedSemesterId) return;
    const payload = { ...values, semesterId: selectedSemesterId };

    try {
      if (mode === "edit" && config) {
        await updateConfig({ id: config._id, data: payload }).unwrap();
        setSuccessMessage(t("schedule.settings.updated"));
      } else {
        await createConfig(payload).unwrap();
        setSuccessMessage(t("schedule.settings.created"));
      }
      setMode("view");
    } catch {
      // الخطأ معروض عبر submitError – نُبقي النموذج مفتوحاً
    }
  };

  const confirmDelete = async () => {
    if (!config) return;
    try {
      await deleteConfig({
        id: config._id,
        semesterId: selectedSemesterId,
      }).unwrap();
      setConfirmingDelete(false);
      setMode("view");
      setSuccessMessage(t("schedule.settings.deleted"));
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
    config,
    subjects: subjectsQuery.data ?? [],
    subjectsLoading: subjectsQuery.isLoading,
    subjectGroups: subjectGroupsQuery.data ?? [],
    subjectGroupsLoading: subjectGroupsQuery.isLoading,
    configLoading: configQuery.isLoading,
    configFetching: configQuery.isFetching,
    configError: configQuery.isError ? errorMessage(configQuery.error) : "",

    // الحالة
    mode,
    isSubmitting,
    submitError,
    successMessage,
    isConfirmingDelete,
    isDeleting: deleteState.isLoading,
    deleteError: deleteState.error ? errorMessage(deleteState.error) : "",

    // الإجراءات
    selectSemester,
    startCreate,
    startEdit,
    cancelForm,
    submit,
    askDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    confirmDelete,
    refetch: () => configQuery.refetch(),
    dismissSuccess: () => setSuccessMessage(""),
  };
}
