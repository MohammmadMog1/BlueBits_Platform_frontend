import { useMemo } from "react";
import { useAppSelector } from "../../../../app/store/hooks";
import { useAllLectures } from "./useAllLectures";
import { getRecentDownloadIds, extractYearId } from "../utils/recentDownloads";
import type { LecturePopulated } from "../types";

export function useRecentDownloads(limit: number) {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id ?? "";
  const userYearId = extractYearId(user?.yearId);

  const { lectures: allLectures, loading } = useAllLectures();

  const recentLectures = useMemo(() => {
    const recentIds = getRecentDownloadIds(userId, limit);
    if (recentIds.length === 0) return [];

    const byId = new Map(allLectures.map((l) => [l._id, l]));
    return recentIds
      .map((id) => byId.get(id))
      .filter((l): l is LecturePopulated => Boolean(l))
      .filter((l) => {
        if (!userYearId) return true;
        const lectureYearId = extractYearId(l.subjectId?.yearId as any);
        return lectureYearId === userYearId;
      });
  }, [allLectures, userId, userYearId, limit]);

  return { recentLectures, loading };
}