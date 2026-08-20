import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../app/store/hooks";
import { useGetPersonalTasksQuery } from "../../../personalTasks/api/personalTasksApi";
import { useGetAcademicTasksQuery } from "../../../admin/tasks/api/academicTasksApi";
import { useGetMyAnnouncementsQuery } from "../../../admin/announcements/api/announcementsApi";
import { useGetActiveSurveyFormQuery } from "../../../admin/surveys/api/surveysApi";
import { useGetYearsQuery } from "../../../admin/academic/api/academicApi";
import { useNow } from "../../../../shared/hooks/useNow";
import { useLatestLectures } from "../../Lectures/hooks/useLatestLectures";
import type { DeadlineItem, UserDashboardState } from "../types";

const UPCOMING_LIMIT = 5;
const LATEST_LECTURES_LIMIT = 4;
const ANNOUNCEMENTS_LIMIT = 3;

const percent = (part: number, whole: number): number =>
  whole > 0 ? Math.round((part / whole) * 100) : 0;

/**
 * مصدر واحد لبيانات داشبورد الطالب.
 * كل الـ endpoints مستخدمة أصلاً في صفحات الطالب، فالكاش يمنع تكرار الطلبات.
 */
export function useUserDashboard(): UserDashboardState {
  const { t } = useTranslation("dashboard");
  const now = useNow();
  const studentName = useAppSelector((state) => state.auth.user?.name ?? "");
  const studentYearId = useAppSelector((state) => state.auth.user?.yearId ?? "");

  const {
    data: personalTasksData,
    isLoading: personalLoading,
    isFetching: personalFetching,
    isError: personalIsError,
    refetch: refetchPersonalTasks,
  } = useGetPersonalTasksQuery();

  const {
    data: academicTasksData,
    isLoading: academicLoading,
    isFetching: academicFetching,
    isError: academicIsError,
    refetch: refetchAcademicTasks,
  } = useGetAcademicTasksQuery();

  const {
    data: announcementsData,
    isFetching: announcementsFetching,
    refetch: refetchAnnouncements,
  } = useGetMyAnnouncementsQuery();

  const {
    data: activeSurveyData,
    isFetching: surveyFetching,
    refetch: refetchSurvey,
  } = useGetActiveSurveyFormQuery();

  const { data: yearsData } = useGetYearsQuery();

  const { latestLectures, loading: lecturesLoading } =
    useLatestLectures(LATEST_LECTURES_LIMIT);

  const yearName = useMemo(() => {
    if (!studentYearId) return "";
    return yearsData?.find((year) => year._id === studentYearId)?.name ?? "";
  }, [studentYearId, yearsData]);

  const tasks = useMemo(() => {
    const personal = personalTasksData ?? [];
    const academic = academicTasksData ?? [];

    const personalDone = personal.filter((task) => task.isCompleted).length;
    const academicClosed = academic.filter((task) => task.status === "closed").length;
    const totalTasks = personal.length + academic.length;

    return {
      personalTotal: personal.length,
      personalDone,
      personalOverdue: personal.filter(
        (task) =>
          !task.isCompleted &&
          task.dueDate &&
          new Date(task.dueDate).getTime() < now,
      ).length,
      academicOpen: academic.length - academicClosed,
      academicTotal: academic.length,
      progress: percent(personalDone + academicClosed, totalTasks),
    };
  }, [personalTasksData, academicTasksData, now]);

  const upcoming = useMemo(() => {
    const personalItems: DeadlineItem[] = (personalTasksData ?? [])
      .filter((task) => !task.isCompleted && task.dueDate)
      .map((task) => ({
        id: task._id,
        title: task.title,
        subtitle: task.description?.trim() || t("deadlines.personalFallback"),
        dueDate: task.dueDate,
        source: "personal" as const,
        to: "/user/todo",
      }));

    const academicItems: DeadlineItem[] = (academicTasksData ?? [])
      .filter((task) => task.status === "open")
      .map((task) => ({
        id: task._id,
        title: task.title,
        subtitle: task.subjectId?.name ?? t("deadlines.academicFallback"),
        dueDate: task.closesAt,
        source: "academic" as const,
        to: "/user/todo",
      }));

    return [...personalItems, ...academicItems]
      .filter((item) => !Number.isNaN(new Date(item.dueDate).getTime()))
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
      .slice(0, UPCOMING_LIMIT);
  }, [personalTasksData, academicTasksData, t]);

  const announcements = useMemo(() => {
    return [...(announcementsData ?? [])]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, ANNOUNCEMENTS_LIMIT);
  }, [announcementsData]);

  const survey = useMemo(() => {
    const form = activeSurveyData?.form ?? null;
    const alreadySubmitted = activeSurveyData?.alreadySubmitted ?? false;
    return {
      form,
      alreadySubmitted,
      shouldPrompt: Boolean(form && form.status === "open" && !alreadySubmitted),
    };
  }, [activeSurveyData]);

  const refresh = useCallback(() => {
    refetchPersonalTasks();
    refetchAcademicTasks();
    refetchAnnouncements();
    refetchSurvey();
  }, [
    refetchPersonalTasks,
    refetchAcademicTasks,
    refetchAnnouncements,
    refetchSurvey,
  ]);

  return {
    studentName,
    yearName,
    tasks,
    upcoming,
    latestLectures,
    announcements,
    survey,
    isLoading: personalLoading || academicLoading || lecturesLoading,
    isFetching:
      personalFetching ||
      academicFetching ||
      announcementsFetching ||
      surveyFetching,
    isError: personalIsError || academicIsError,
    refresh,
  };
}
