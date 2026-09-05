import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useGetSemestersQuery, useGetYearsQuery } from "../../academic/api/academicApi";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import {
  useAddSubjectToGroupMutation,
  useCreateSubjectGroupMutation,
  useDeleteSubjectGroupMutation,
  useGetSubjectGroupsBySemesterDetailedQuery,
  useRemoveSubjectFromGroupMutation,
  useUpdateSubjectGroupMutation,
} from "../api/subjectGroupsApi";
import { getRefId } from "../utils/schedule";

/**
 * إدارة غروبات المواد الاختيارية: تُنشأ لسنة وفصل محدَّدين معاً
 * (على عكس بقية الميزة التي تتعامل مع الفصل وحده)، لذا للصفحة
 * منتقي سنة/فصل خاص بها بدل الاعتماد على `useScheduleConfigManager`.
 */
export function useSubjectGroupsManager() {
  const { t } = useTranslation("admin");
  const errorMessage = useErrorMessage();

  const [pickedYearId, setPickedYearId] = useState("");
  const [pickedSemesterId, setPickedSemesterId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [groupPendingDelete, setGroupPendingDelete] = useState<string | null>(null);

  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
  const { data: semesters = [], isLoading: semestersLoading } = useGetSemestersQuery();

  const selectedYearId = pickedYearId || years[0]?._id || "";
  const selectedSemesterId = pickedSemesterId || semesters[0]?._id || "";

  const groupsQuery = useGetSubjectGroupsBySemesterDetailedQuery(selectedSemesterId, {
    skip: !selectedSemesterId,
  });
  const subjectsQuery = useGetSubjectsQuery(
    { yearId: selectedYearId, semesterId: selectedSemesterId },
    { skip: !selectedYearId || !selectedSemesterId },
  );

  const [createGroupMutation, createState] = useCreateSubjectGroupMutation();
  const [updateGroupMutation, updateState] = useUpdateSubjectGroupMutation();
  const [deleteGroupMutation, deleteState] = useDeleteSubjectGroupMutation();
  const [addSubjectMutation, addSubjectState] = useAddSubjectToGroupMutation();
  const [removeSubjectMutation, removeSubjectState] = useRemoveSubjectFromGroupMutation();

  const groups = useMemo(
    () => (groupsQuery.data ?? []).filter((group) => getRefId(group.yearId) === selectedYearId),
    [groupsQuery.data, selectedYearId],
  );

  const subjects = subjectsQuery.data ?? [];
  const groupedSubjectIds = useMemo(
    () => new Set(groups.flatMap((group) => (group.subjects ?? []).map((subject) => subject._id))),
    [groups],
  );
  const ungroupedSubjects = useMemo(
    () => (subjectsQuery.data ?? []).filter((subject) => !groupedSubjectIds.has(subject._id)),
    [subjectsQuery.data, groupedSubjectIds],
  );

  const resetFeedback = () => {
    setSuccessMessage("");
    createState.reset();
    updateState.reset();
    deleteState.reset();
    addSubjectState.reset();
    removeSubjectState.reset();
  };

  const selectYear = (yearId: string) => {
    setPickedYearId(yearId);
    resetFeedback();
  };

  const selectSemester = (semesterId: string) => {
    setPickedSemesterId(semesterId);
    resetFeedback();
  };

  const createGroup = async (name: string) => {
    if (!selectedYearId || !selectedSemesterId) return;
    resetFeedback();
    try {
      await createGroupMutation({
        name,
        yearId: selectedYearId,
        semesterId: selectedSemesterId,
      }).unwrap();
      setSuccessMessage(t("schedule.groups.created"));
    } catch {
      // الخطأ معروض عبر createError
    }
  };

  const renameGroup = async (id: string, name: string) => {
    resetFeedback();
    try {
      await updateGroupMutation({ id, data: { name } }).unwrap();
      setSuccessMessage(t("schedule.groups.updated"));
    } catch {
      // الخطأ معروض عبر updateError
    }
  };

  const askDeleteGroup = (id: string) => setGroupPendingDelete(id);
  const cancelDeleteGroup = () => setGroupPendingDelete(null);

  const confirmDeleteGroup = async () => {
    if (!groupPendingDelete) return;
    resetFeedback();
    try {
      await deleteGroupMutation(groupPendingDelete).unwrap();
      setSuccessMessage(t("schedule.groups.deleted"));
      setGroupPendingDelete(null);
    } catch {
      // الخطأ معروض في نافذة التأكيد
    }
  };

  const addSubject = async (groupId: string, subjectId: string) => {
    resetFeedback();
    try {
      await addSubjectMutation({ id: groupId, subjectId }).unwrap();
      setSuccessMessage(t("schedule.groups.subjectAdded"));
    } catch {
      // الخطأ معروض عبر addSubjectError
    }
  };

  const removeSubject = async (groupId: string, subjectId: string) => {
    resetFeedback();
    try {
      await removeSubjectMutation({ id: groupId, subjectId }).unwrap();
      setSuccessMessage(t("schedule.groups.subjectRemoved"));
    } catch {
      // الخطأ معروض عبر removeSubjectError
    }
  };

  return {
    years,
    yearsLoading,
    semesters,
    semestersLoading,
    selectedYearId,
    selectedSemesterId,
    selectYear,
    selectSemester,

    groups,
    groupsLoading: groupsQuery.isLoading,
    groupsError: groupsQuery.isError ? errorMessage(groupsQuery.error) : "",

    subjects,
    subjectsLoading: subjectsQuery.isLoading,
    ungroupedSubjects,

    successMessage,
    dismissSuccess: () => setSuccessMessage(""),

    createGroup,
    isCreating: createState.isLoading,
    createError: createState.error ? errorMessage(createState.error) : "",

    renameGroup,
    isRenaming: updateState.isLoading,
    renameError: updateState.error ? errorMessage(updateState.error) : "",

    groupPendingDelete,
    askDeleteGroup,
    cancelDeleteGroup,
    confirmDeleteGroup,
    isDeleting: deleteState.isLoading,
    deleteError: deleteState.error ? errorMessage(deleteState.error) : "",

    addSubject,
    isAddingSubject: addSubjectState.isLoading,
    addSubjectError: addSubjectState.error ? errorMessage(addSubjectState.error) : "",

    removeSubject,
    isRemovingSubject: removeSubjectState.isLoading,
  };
}
