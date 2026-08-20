import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import {
  getLectureDownloadInfo,
  downloadLectureAsBlob,
  getLecturesCountPerSubject,
} from "../api/lecturesService";
import type {
  LecturePopulated,
  LectureType,
  LectureSubjectStats,
} from "../types";

export type LectureStep = "year" | "semester" | "subject" | "type" | "lectures"; // ✅ تم تبديل الترتيب

export interface UseLectureManagerReturn {
  years: { _id: string; name: string }[];
  semesters: { _id: string; name: string }[];
  subjects: { _id: string; name: string }[];
  lectures: LecturePopulated[];
  contextLectures: LecturePopulated[];
  yearsLoading: boolean;
  semestersLoading: boolean;
  subjectsLoading: boolean;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  step: LectureStep;
  selectedYearId: string;
  selectedSemesterId: string;
  selectedSubjectId: string;
  selectedType: LectureType;
  search: string;
  setSearch: (v: string) => void;
  selectYear: (yearId: string) => void;
  selectSemester: (semesterId: string) => void;
  selectType: (type: LectureType) => void;
  selectSubject: (subjectId: string) => void;
  goBack: () => void;
  navTo: (target: LectureStep) => void;
  handleDelete: (id: string) => Promise<void>;
  handleDownload: (lecture: LecturePopulated) => Promise<void>;
  handleView: (lecture: LecturePopulated) => Promise<void>;
  handleToggleStatus: (lecture: LecturePopulated) => Promise<void>;
  handleRename: (lecture: LecturePopulated, title: string) => Promise<void>;
  showUpload: boolean;
  openUpload: () => void;
  closeUpload: () => void;
  stats: { label: string; value: number | string; color: string }[];
}

export function useLectureManager(): UseLectureManagerReturn {
  const { t } = useTranslation("admin");
  const dispatch = useAppDispatch();
  const { items: lectures, fetchStatus } = useAppSelector(
    (state) => state.lectures,
  );

  const [step, setStep] = useState<LectureStep>("year");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedType, setSelectedType] = useState<LectureType>("theoretical");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [subjectStats, setSubjectStats] = useState<LectureSubjectStats[]>([]);

  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
  const { data: semesters = [], isLoading: semestersLoading } =
    useGetSemestersQuery();

  // ✅ تُجلب المواد الآن عند اختيار السنة والفصل فقط (بدون النوع)
  const { data: subjects = [], isLoading: subjectsLoading } =
    useGetSubjectsQuery(
      { yearId: selectedYearId, semesterId: selectedSemesterId },
      { skip: !selectedYearId || !selectedSemesterId },
    );

  // ✅ تُجلب المحاضرات عندما نكون في خطوة "lectures" ويتوفر لدينا subjectId و type
  const lectureFiltersReady = Boolean(
    step === "lectures" && selectedSubjectId && selectedType,
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

  useEffect(() => {
    getLecturesCountPerSubject()
      .then((stats) => setSubjectStats(stats))
      .catch(() => setSubjectStats([]));
  }, []);

  const contextLectures = useMemo(
    () =>
      lectures.filter(
        (l) =>
          l.subjectId._id === selectedSubjectId &&
          l.type === selectedType &&
          (!search || l.title.toLowerCase().includes(search.toLowerCase())),
      ),
    [lectures, selectedSubjectId, selectedType, search],
  );

  const stats = useMemo(() => {
    const safeStats = Array.isArray(subjectStats) ? subjectStats : [];
    const currentSubjectStats = safeStats.find(
      (s) => s.subjectId === selectedSubjectId,
    );
    const totalLectures = currentSubjectStats?.totalLectures ?? lectures.length;
    const theoreticalCount =
      currentSubjectStats?.theoreticalCount ??
      lectures.filter((l) => l.type === "theoretical").length;
    const practicalCount =
      currentSubjectStats?.practicalCount ??
      lectures.filter((l) => l.type === "practical").length;
    const publishedCount = lectures.filter((l) => l.isPublished).length;

    return [
      {
        label: t("lectureManagement.stats.totalLectures"),
        value: totalLectures,
        color: "#404293",
      },
      {
        label: t("lectureManagement.stats.published"),
        value: publishedCount,
        color: "#059669",
      },
      {
        label: t("lectureManagement.stats.theoretical"),
        value: theoreticalCount,
        color: "#2376BB",
      },
      {
        label: t("lectureManagement.stats.practical"),
        value: practicalCount,
        color: "#F59E0B",
      },
    ];
  }, [lectures, subjectStats, selectedSubjectId, t]);

  // ─────────────────────────────────────────
  // Navigation (تم تحديث الترتيب)
  // ─────────────────────────────────────────
  const selectYear = useCallback((yearId: string) => {
    setSelectedYearId(yearId);
    setSelectedSemesterId("");
    setSelectedSubjectId("");
    setSelectedType("theoretical");
    setSearch("");
    setStep("semester");
  }, []);

  const selectSemester = useCallback((semesterId: string) => {
    setSelectedSemesterId(semesterId);
    setSelectedSubjectId("");
    setSearch("");
    setStep("subject"); // ✅ الخطوة التالية هي اختيار المادة
  }, []);

  const selectSubject = useCallback((subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSearch("");
    setStep("type"); // ✅ الخطوة التالية هي اختيار النوع
  }, []);

  const selectType = useCallback((type: LectureType) => {
    setSelectedType(type);
    setSearch("");
    setStep("lectures"); // ✅ الخطوة التالية هي عرض المحاضرات
  }, []);

  const goBack = useCallback(() => {
    setSearch("");
    if (step === "lectures") setStep("type");
    else if (step === "type") setStep("subject");
    else if (step === "subject") setStep("semester");
    else if (step === "semester") setStep("year");
  }, [step]);

  const navTo = useCallback(
    (target: LectureStep) => {
      if (target === "year") setStep("year");
      else if (target === "semester" && selectedYearId) setStep("semester");
      else if (target === "subject" && selectedSemesterId) setStep("subject");
      else if (target === "type" && selectedSubjectId) setStep("type");
    },
    [selectedYearId, selectedSemesterId, selectedSubjectId],
  );

  // CRUD operations (كما هي)
  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(deleteLectureThunk(id))
        .unwrap()
        .catch(() => undefined);
    },
    [dispatch],
  );

  const handleDownload = useCallback(async (lecture: LecturePopulated) => {
    try {
      const info = await getLectureDownloadInfo(lecture._id);
      const blob = await downloadLectureAsBlob(lecture._id);
      const fileName = `${info.title || lecture.title}.${info.fileType.split("/")[1] || "pdf"}`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {}
  }, []);

  const handleView = useCallback(async (lecture: LecturePopulated) => {
    try {
      const info = await getLectureDownloadInfo(lecture._id);
      if (info.downloadUrl) window.open(info.downloadUrl, "_blank");
    } catch {}
  }, []);

  const handleToggleStatus = useCallback(
    async (lecture: LecturePopulated) => {
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
    async (lecture: LecturePopulated, title: string) => {
      await dispatch(updateLectureThunk({ id: lecture._id, data: { title } }))
        .unwrap()
        .catch(() => undefined);
    },
    [dispatch],
  );

  const openUpload = useCallback(() => setShowUpload(true), []);
  const closeUpload = useCallback(() => setShowUpload(false), []);

  return {
    years,
    semesters,
    subjects,
    lectures,
    contextLectures,
    yearsLoading,
    semestersLoading,
    subjectsLoading,
    fetchStatus,
    step,
    selectedYearId,
    selectedSemesterId,
    selectedSubjectId,
    selectedType,
    search,
    setSearch,
    selectYear,
    selectSemester,
    selectType,
    selectSubject,
    goBack,
    navTo,
    handleDelete,
    handleDownload,
    handleView,
    handleToggleStatus,
    handleRename,
    showUpload,
    openUpload,
    closeUpload,
    stats,
  };
}
