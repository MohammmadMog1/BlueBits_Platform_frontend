import { useMemo } from "react";
import { useAllLectures } from "./useAllLectures";

export function useLatestLectures(limit: number) {
  const { lectures: allLectures, loading } = useAllLectures();

  const latestLectures = useMemo(() => {
    return allLectures
      .filter((l) => l.isPublished)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }, [allLectures, limit]);

  return { latestLectures, loading };
}