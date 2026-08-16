import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";
import {
  useGetYearsQuery,
  useGetSemestersQuery,
} from "../../../admin/academic/api/academicApi";
import { useGetSubjectsQuery } from "../../../admin/subjects/api/subjectsApi";
import { fetchLecturesThunk } from "../redux/lecturesThunks";
import {
  getLectureDownloadInfo,
  downloadLectureAsBlob,
} from "../api/lecturesService";
import type { LecturePopulated, LectureType } from "../types";

import { recordDownload } from "../utils/recentDownloads";

export type LectureStep = "year" | "semester" | "subject" | "type" | "lectures";

export interface UseLecturesReturn {
  years: { _id: string; name: string }[];
  semesters: { _id: string; name: string }[];
  subjects: { _id: string; name: string }[];
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
  selectSubject: (subjectId: string) => void;
  selectType: (type: LectureType) => void;
  goBack: () => void;
  navTo: (target: LectureStep) => void;
  handleDownload: (lecture: LecturePopulated) => Promise<void>;
  handleView: (lecture: LecturePopulated) => Promise<void>;
}

export function useLectures(): UseLecturesReturn {
  const dispatch = useAppDispatch();
  const { items: lectures, fetchStatus } = useAppSelector(
    (state) => state.userLectures,
  );
  //new
  const userId = useAppSelector((state) => state.auth.user?._id ?? "");

  const [step, setStep] = useState<LectureStep>("year");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedType, setSelectedType] = useState<LectureType>("theoretical");
  const [search, setSearch] = useState("");

  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
  const { data: semesters = [], isLoading: semestersLoading } =
    useGetSemestersQuery();

  const { data: subjects = [], isLoading: subjectsLoading } =
    useGetSubjectsQuery(
      { yearId: selectedYearId, semesterId: selectedSemesterId },
      { skip: !selectedYearId || !selectedSemesterId },
    );

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

  // اليوزر يشوف بس المحاضرات المنشورة (isPublished)
  const contextLectures = useMemo(
    () =>
      lectures.filter(
        (l) =>
          l.subjectId._id === selectedSubjectId &&
          l.type === selectedType &&
          l.isPublished &&
          (!search || l.title.toLowerCase().includes(search.toLowerCase())),
      ),
    [lectures, selectedSubjectId, selectedType, search],
  );

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
    setStep("subject");
  }, []);

  const selectSubject = useCallback((subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSearch("");
    setStep("type");
  }, []);

  const selectType = useCallback((type: LectureType) => {
    setSelectedType(type);
    setSearch("");
    setStep("lectures");
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

 const handleDownload = useCallback(
  async (lecture: LecturePopulated) => {
    try {
      const info = await getLectureDownloadInfo(lecture._id);
      const blob = await downloadLectureAsBlob(lecture._id);
      const fileName = `${info.title || lecture.title}.${
        info.fileType.split("/")[1] || "pdf"
      }`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);

      recordDownload(userId, lecture._id);
    } catch {}
  },
  [userId],
);

  const handleView = useCallback(async (lecture: LecturePopulated) => {
    try {
      const info = await getLectureDownloadInfo(lecture._id);
      if (info.downloadUrl) window.open(info.downloadUrl, "_blank");
    } catch {}
  }, []);

  return {
    years,
    semesters,
    subjects,
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
    selectSubject,
    selectType,
    goBack,
    navTo,
    handleDownload,
    handleView,
  };
}