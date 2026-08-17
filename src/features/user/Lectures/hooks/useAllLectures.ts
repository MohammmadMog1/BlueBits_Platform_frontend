import { useEffect, useState } from "react";
import { getAllLectures } from "../api/lecturesService";
import type { LecturePopulated } from "../types";

let inFlightRequest: Promise<LecturePopulated[]> | null = null;

const fetchAllLecturesOnce = (): Promise<LecturePopulated[]> => {
  if (!inFlightRequest) {
    inFlightRequest = getAllLectures().finally(() => {
      inFlightRequest = null;
    });
  }
  return inFlightRequest;
};

// Shared by useLatestLectures and useRecentDownloads so mounting both at once
// (as UserLectureManager does) triggers a single "/lectures" request, not two.
export function useAllLectures() {
  const [lectures, setLectures] = useState<LecturePopulated[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAllLecturesOnce()
      .then((data) => {
        if (!cancelled) setLectures(data);
      })
      .catch(() => {
        if (!cancelled) setLectures([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { lectures, loading };
}
