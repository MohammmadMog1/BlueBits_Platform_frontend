/**
 * useLectureManager
 *
 * Hook مخصص يغلف كل منطق صفحة إدارة المحاضرات.
 * الترتيب: year → semester → type → subject → lectures
 *
 * ✅ السنوات والفصول تُجلب مرة واحدة فقط (RTK Query Cache – keepUnusedDataFor: 3600)
 * ✅ المواد تُجلب عند اختيار السنة + الفصل
 * ✅ المحاضرات تُجلب عند اختيار المادة + النوع
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";
import {
  useGetYearsQuery,
  useGetSemestersQuery,
} from "../../academic/api/academicApi";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import {
  deleteLectureThunk,
  fetchLecturesThunk,
  updateLectureThunk,
} from "../redux/lecturesThunks";
import { downloadLecture } from "../api/lecturesService";
import type { Lecture, LectureType } from "../types";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type LectureStep = "year" | "semester" | "type" | "subject" | "lectures";

export interface UseLectureManagerReturn {
  // ── Data ──────────────────────────────────
  years: { _id: string; name: string }[];
  semesters: { _id: string; name: string }[];
  subjects: { _id: string; name: string }[];
  lectures: Lecture[];
  contextLectures: Lecture[];

  // ── Loading states ─────────────────────────
  yearsLoading: boolean;
  semestersLoading: boolean;
  subjectsLoading: boolean;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";

  // ── Selection state ────────────────────────
  step: LectureStep;
  selectedYearId: string;
  selectedSemesterId: string;
  selectedSubjectId: string;
  selectedType: LectureType;
  search: string;

  // ── Setters ────────────────────────────────
  setSearch: (v: string) => void;

  // ── Navigation ─────────────────────────────
  selectYear: (yearId: string) => void;
  selectSemester: (semesterId: string) => void;
  selectType: (type: LectureType) => void;
  selectSubject: (subjectId: string) => void;
  goBack: () => void;
  navTo: (target: LectureStep) => void;

  // ── CRUD ───────────────────────────────────
  handleDelete: (id: string) => Promise<void>;
  handleDownload: (lecture: Lecture) => Promise<void>;
  handleView: (lecture: Lecture) => Promise<void>;
  handleToggleStatus: (lecture: Lecture) => Promise<void>;
  handleRename: (lecture: Lecture, title: string) => Promise<void>;

  // ── Upload modal ───────────────────────────
  showUpload: boolean;
  openUpload: () => void;
  closeUpload: () => void;

  // ── Stats ──────────────────────────────────
  stats: { label: string; value: number | string; color: string }[];
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useLectureManager(): UseLectureManagerReturn {
  const dispatch = useAppDispatch();

  // ── Redux state ───────────────────────────
  const { items: lectures, fetchStatus } = useAppSelector(
    (state) => state.lectures,
  );

  // ── Step machine ──────────────────────────
  const [step, setStep] = useState<LectureStep>("year");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedType, setSelectedType] = useState<LectureType>("theoretical");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  // ── RTK Query – السنوات والفصول ───────────
  // تُجلب مرة واحدة فقط وتبقى في الكاش ساعة كاملة (keepUnusedDataFor: 3600)
  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
  const { data: semesters = [], isLoading: semestersLoading } =
    useGetSemestersQuery();

  // ── RTK Query – المواد ────────────────────
  // تُجلب عند اختيار السنة والفصل والنوع فقط
  const { data: subjects = [], isLoading: subjectsLoading } =
    useGetSubjectsQuery(
      {
        yearId: selectedYearId,
        semesterId: selectedSemesterId,
        type: selectedType,
      },
      { skip: !selectedYearId || !selectedSemesterId || !selectedType },
    );

  // ── Fetch lectures ────────────────────────
  // تُجلب عند الانتقال لخطوة "lectures" مع اكتمال جميع المعاملات
  const lectureFiltersReady = Boolean(
    step === "lectures" &&
    selectedYearId &&
    selectedSemesterId &&
    selectedSubjectId &&
    selectedType,
  );

  useEffect(() => {
    if (!lectureFiltersReady) return;

    dispatch(
      fetchLecturesThunk({
        yearId: selectedYearId,
        semesterId: selectedSemesterId,
        subjectId: selectedSubjectId,
        type: selectedType,
      }),
    );
  }, [
    dispatch,
    lectureFiltersReady,
    selectedYearId,
    selectedSemesterId,
    selectedSubjectId,
    selectedType,
  ]);

  // ── Filtered lectures for current context ─
  const contextLectures = useMemo(
    () =>
      lectures.filter(
        (l) =>
          l.yearId === selectedYearId &&
          l.semesterId === selectedSemesterId &&
          l.subjectId === selectedSubjectId &&
          l.type === selectedType &&
          (!search || l.title.toLowerCase().includes(search.toLowerCase())),
      ),
    [
      lectures,
      selectedYearId,
      selectedSemesterId,
      selectedSubjectId,
      selectedType,
      search,
    ],
  );

  // ── Stats ─────────────────────────────────
  const stats = useMemo(
    () => [
      { label: "Total Lectures", value: lectures.length, color: "#404293" },
      {
        label: "Published",
        value: lectures.filter((l) => l.isPublished).length,
        color: "#059669",
      },
      {
        label: "Total Downloads",
        value: lectures
          .reduce((sum, l) => sum + (l.downloads ?? 0), 0)
          .toLocaleString(),
        color: "#F59E0B",
      },
      {
        label: "Drafts",
        value: lectures.filter((l) => !l.isPublished).length,
        color: "#6B7280",
      },
    ],
    [lectures],
  );

  // ─────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────

  /** اختيار السنة — تصفير كل الاختيارات اللاحقة */
  const selectYear = useCallback((yearId: string) => {
    setSelectedYearId(yearId);
    setSelectedSemesterId("");
    setSelectedSubjectId("");
    setSelectedType("theoretical");
    setSearch("");
    setStep("semester");
  }, []);

  /** اختيار الفصل */
  const selectSemester = useCallback((semesterId: string) => {
    setSelectedSemesterId(semesterId);
    setSelectedSubjectId("");
    setSelectedType("theoretical");
    setSearch("");
    setStep("type");
  }, []);

  /** اختيار النوع */
  const selectType = useCallback((type: LectureType) => {
    setSelectedType(type);
    setSelectedSubjectId("");
    setSearch("");
    setStep("subject");
  }, []);

  /** اختيار المادة → انتقل مباشرة لجلب المحاضرات */
  const selectSubject = useCallback((subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSearch("");
    setStep("lectures");
  }, []);

  /** رجوع خطوة للخلف */
  const goBack = useCallback(() => {
    setSearch("");
    if (step === "lectures") setStep("subject");
    else if (step === "subject") setStep("type");
    else if (step === "type") setStep("semester");
    else if (step === "semester") setStep("year");
  }, [step]);

  /** انتقل لخطوة معينة (breadcrumb) */
  const navTo = useCallback(
    (target: LectureStep) => {
      if (target === "year") {
        setStep("year");
      } else if (target === "semester" && selectedYearId) {
        setStep("semester");
      } else if (target === "type" && selectedSemesterId) {
        setStep("type");
      } else if (target === "subject" && selectedSemesterId) {
        setStep("subject");
      }
    },
    [selectedYearId, selectedSemesterId],
  );

  // ─────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────

  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(deleteLectureThunk(id))
        .unwrap()
        .catch(() => undefined);
    },
    [dispatch],
  );

  const handleDownload = useCallback(async (lecture: Lecture) => {
    try {
      const response = await downloadLecture(lecture._id);
      const blob = response.data;
      const contentDisposition = response.headers["content-disposition"] || "";
      const fileNameMatch = /filename="?([^";]+)"?/.exec(contentDisposition);
      const fileName = fileNameMatch?.[1] || `${lecture.title}.pdf`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      // Keep silent to avoid blocking UI.
    }
  }, []);

  const handleView = useCallback(async (lecture: Lecture) => {
    try {
      const response = await downloadLecture(lecture._id);
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const popup = window.open("about:blank", "_blank");
      if (!popup) return;
      popup.location.href = url;
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      // Keep silent to avoid blocking UI.
    }
  }, []);

  const handleToggleStatus = useCallback(
    async (lecture: Lecture) => {
      await dispatch(
        updateLectureThunk({
          id: lecture._id,
          data: { isPublished: !lecture.isPublished },
        }),
      )
        .unwrap()
        .catch(() => undefined);
    },
    [dispatch],
  );

  const handleRename = useCallback(
    async (lecture: Lecture, title: string) => {
      await dispatch(updateLectureThunk({ id: lecture._id, data: { title } }))
        .unwrap()
        .catch(() => undefined);
    },
    [dispatch],
  );

  // ─────────────────────────────────────────
  // Upload modal
  // ─────────────────────────────────────────
  const openUpload = useCallback(() => setShowUpload(true), []);
  const closeUpload = useCallback(() => setShowUpload(false), []);

  return {
    // Data
    years,
    semesters,
    subjects,
    lectures,
    contextLectures,

    // Loading
    yearsLoading,
    semestersLoading,
    subjectsLoading,
    fetchStatus,

    // State
    step,
    selectedYearId,
    selectedSemesterId,
    selectedSubjectId,
    selectedType,
    search,
    setSearch,

    // Navigation
    selectYear,
    selectSemester,
    selectType,
    selectSubject,
    goBack,
    navTo,

    // CRUD
    handleDelete,
    handleDownload,
    handleView,
    handleToggleStatus,
    handleRename,

    // Upload
    showUpload,
    openUpload,
    closeUpload,

    // Stats
    stats,
  };
}
