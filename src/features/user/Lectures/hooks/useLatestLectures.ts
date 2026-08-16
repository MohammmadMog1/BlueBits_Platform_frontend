import { useEffect, useMemo, useState } from "react";
import { getAllLectures } from "../api/lecturesService";
import type { LecturePopulated } from "../types";

export function useLatestLectures(limit: number) {
  const [allLectures, setAllLectures] = useState<LecturePopulated[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllLectures()
      .then((data) => {
        if (!cancelled) setAllLectures(data);
      })
      .catch(() => {
        if (!cancelled) setAllLectures([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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