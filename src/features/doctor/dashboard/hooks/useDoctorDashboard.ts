import { useCallback, useMemo } from "react";
import { useGetMyLecturesQuery, useGetMyStatsQuery } from "../../api/doctorApi";
import type { DoctorDashboardState } from "../types";

const RECENT_LECTURES_LIMIT = 5;

/**
 * مصدر واحد لكل أرقام داشبورد الدكتور.
 * يعتمد على نفس endpoints صفحات "محاضراتي"/"بنوك أسئلتي"، فكاش RTK Query
 * يمنع تكرار الطلبات عند التنقّل بين الداشبورد وتلك الصفحات.
 */
export function useDoctorDashboard(): DoctorDashboardState {
  const {
    data: stats,
    isLoading: statsLoading,
    isFetching: statsFetching,
    isError: statsIsError,
    refetch: refetchStats,
  } = useGetMyStatsQuery();

  const {
    data: lecturesData,
    isLoading: lecturesLoading,
    isFetching: lecturesFetching,
    isError: lecturesIsError,
    refetch: refetchLectures,
  } = useGetMyLecturesQuery();

  const content = useMemo(() => {
    const list = stats ?? [];
    return list.reduce(
      (acc, item) => {
        acc.subjects += 1;
        acc.lecturesTotal += item.lectures?.total ?? 0;
        acc.lecturesPublished += item.lectures?.published ?? 0;
        acc.lecturesDraft += item.lectures?.draft ?? 0;
        acc.banksTotal += item.questionBanks?.total ?? 0;
        acc.banksPublished += item.questionBanks?.published ?? 0;
        acc.banksDraft += item.questionBanks?.draft ?? 0;
        acc.totalQuestions += item.questionBanks?.totalQuestions ?? 0;
        return acc;
      },
      {
        subjects: 0,
        lecturesTotal: 0,
        lecturesPublished: 0,
        lecturesDraft: 0,
        banksTotal: 0,
        banksPublished: 0,
        banksDraft: 0,
        totalQuestions: 0,
      },
    );
  }, [stats]);

  const recentLectures = useMemo(() => {
    return [...(lecturesData ?? [])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, RECENT_LECTURES_LIMIT);
  }, [lecturesData]);

  const refresh = useCallback(() => {
    refetchStats();
    refetchLectures();
  }, [refetchStats, refetchLectures]);

  return {
    stats: stats ?? [],
    content,
    recentLectures,
    isLoading: statsLoading || lecturesLoading,
    isFetching: statsFetching || lecturesFetching,
    isError: statsIsError || lecturesIsError,
    refresh,
  };
}
