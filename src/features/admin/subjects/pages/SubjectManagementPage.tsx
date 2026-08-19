import { useState } from "react";
import {
  AlertCircle,
  BookMarked,
  GraduationCap,
  Layers,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppSelector } from "../../../../app/store/hooks";
import {
  useGetSemestersQuery,
  useGetYearsQuery,
} from "../../academic/api/academicApi";
import SubjectCard from "../components/SubjectCard";
import SubjectFormModal from "../components/SubjectFormModal";
import {
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useGetSubjectsQuery,
  useUpdateSubjectMutation,
} from "../api/subjectsApi";
import type { Subject, SubjectFormData } from "../types";

const errorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    )
      return data.message;
  }
  return "تعذّر تنفيذ الطلب. حاول مرة أخرى.";
};

const getUserId = (user: { _id: string } | null) => user?._id ?? "";

export default function SubjectManagementPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const subjectsQuery = useGetSubjectsQuery({
    yearId: filterYear || undefined,
    semesterId: filterSemester || undefined,
  });
  const { data: years = [] } = useGetYearsQuery();
  const { data: semesters = [] } = useGetSemestersQuery();
  const [createSubject, createState] = useCreateSubjectMutation();
  const [updateSubject, updateState] = useUpdateSubjectMutation();
  const [deleteSubject, deleteState] = useDeleteSubjectMutation();

  const subjects = subjectsQuery.data ?? [];
  const yearOptions = years.map((year) => ({ id: year._id, label: year.name }));
  const semesterOptions = semesters.map((semester) => ({
    id: semester._id,
    label: semester.name,
  }));
  const filteredSubjects = subjects.filter((subject) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      subject.name.toLowerCase().includes(term) ||
      (subject.description ?? "").toLowerCase().includes(term)
    );
  });
  const getYearLabel = (id: string) =>
    yearOptions.find((option) => option.id === id)?.label ?? "—";
  const getSemesterLabel = (id: string) =>
    semesterOptions.find((option) => option.id === id)?.label ?? "—";
  const mutationError =
    createState.error || updateState.error || deleteState.error;
  const modalError = createState.error
    ? errorMessage(createState.error)
    : updateState.error
      ? errorMessage(updateState.error)
      : undefined;

  const handleSubmit = async (data: SubjectFormData) => {
    try {
      if (editSubject) {
        await updateSubject({ id: editSubject._id, data }).unwrap();
        setEditSubject(null);
      } else {
        await createSubject({ ...data, createdBy: getUserId(user) }).unwrap();
        setShowModal(false);
      }
    } catch {
      return;
    }
  };

  const handleDelete = async () => {
    if (!deletingSubject) return;
    try {
      await deleteSubject(deletingSubject._id).unwrap();
      setDeletingSubject(null);
    } catch {
      return;
    }
  };

  const stats = [
    { label: "إجمالي المواد", value: subjects.length, color: "#404293" },
    {
      label: yearOptions[2]?.label ?? "السنة الثالثة",
      value: subjects.filter((subject) => subject.yearId === yearOptions[2]?.id)
        .length,
      color: "#33529F",
    },
    {
      label: semesterOptions[0]?.label ?? "الفصل الأول",
      value: subjects.filter(
        (subject) => subject.semesterId === semesterOptions[0]?.id,
      ).length,
      color: "#2376BB",
    },
    {
      label: semesterOptions[1]?.label ?? "الفصل الثاني",
      value: subjects.filter(
        (subject) => subject.semesterId === semesterOptions[1]?.id,
      ).length,
      color: "#059669",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
              <BookMarked className="h-[18px] w-[18px] text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              إدارة المواد
            </h1>
          </div>
          <p className="text-sm font-medium text-gray-400">
            إنشاء وتعديل وحذف المواد الدراسية
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => subjectsQuery.refetch()}
            title="تحديث"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:border-[#404293]/30 hover:text-[#404293]"
          >
            <RefreshCcw
              className={`h-4 w-4 ${subjectsQuery.isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-[#404293]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#404293]/45 active:scale-[0.98]"
          >
            <Plus size={17} /> مادة جديدة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="h-8 w-1.5 shrink-0 rounded-full"
              style={{
                background: `linear-gradient(180deg,${stat.color},${stat.color}55)`,
              }}
            />
            <div>
              <p className="text-lg font-black leading-none text-gray-900">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث عن مادة..."
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="مسح البحث"
            >
              <X size={13} className="text-gray-300 hover:text-gray-500" />
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={filterYear}
            onChange={(event) => setFilterYear(event.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
          >
            <option value="">كل السنوات</option>
            {yearOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={filterSemester}
            onChange={(event) => setFilterSemester(event.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
          >
            <option value="">كل الفصول</option>
            {semesterOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        {(filterYear || filterSemester) && (
          <button
            type="button"
            onClick={() => {
              setFilterYear("");
              setFilterSemester("");
            }}
            className="flex items-center gap-1.5 rounded-xl border border-transparent px-3.5 py-2.5 text-xs font-bold text-red-500 transition-colors hover:border-red-100 hover:bg-red-50"
          >
            <X size={13} /> مسح الفلاتر
          </button>
        )}
      </div>

      {subjectsQuery.isError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm font-semibold text-amber-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage(subjectsQuery.error)}
        </motion.div>
      )}
      {mutationError && !showModal && !editSubject && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage(mutationError)}
        </div>
      )}

      {subjectsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
            >
              <div className="mb-5 h-1 w-full rounded-full bg-gray-100" />
              <div className="mb-3 h-4 w-3/4 rounded-full bg-gray-100" />
              <div className="mb-2 h-3 w-full rounded-full bg-gray-100" />
              <div className="mb-5 h-3 w-2/3 rounded-full bg-gray-100" />
              <div className="flex gap-2">
                <div className="h-7 flex-1 rounded-full bg-gray-100" />
                <div className="h-7 flex-1 rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white py-24 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <BookMarked className="h-7 w-7 text-gray-300" />
          </div>
          <p className="mb-1 font-bold text-gray-400">
            {search ? "لا توجد نتائج" : "لا توجد مواد بعد"}
          </p>
          <p className="mb-4 text-sm text-gray-300">
            {search ? "جرّب مصطلح بحث مختلف" : "أضف أول مادة دراسية الآن"}
          </p>
          {!search && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white shadow-md"
            >
              <Plus size={14} /> إضافة مادة
            </button>
          )}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject._id}
                subject={subject}
                yearLabel={getYearLabel(subject.yearId)}
                semesterLabel={getSemesterLabel(subject.semesterId)}
                onEdit={setEditSubject}
                onDelete={setDeletingSubject}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {(showModal || editSubject) && (
          <SubjectFormModal
            isEdit={Boolean(editSubject)}
            initial={
              editSubject
                ? {
                    name: editSubject.name,
                    description: editSubject.description ?? "",
                    yearId: editSubject.yearId,
                    semesterId: editSubject.semesterId,
                  }
                : undefined
            }
            isSubmitting={createState.isLoading || updateState.isLoading}
            error={modalError}
            yearOptions={yearOptions}
            semesterOptions={semesterOptions}
            onClose={() => {
              setShowModal(false);
              setEditSubject(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deletingSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            onClick={() => !deleteState.isLoading && setDeletingSubject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="mb-2 text-lg font-black text-gray-900">
                تأكيد الحذف
              </h3>
              <p className="mb-1 text-sm text-gray-500">ستحذف المادة:</p>
              <p className="mb-6 text-sm font-black text-[#404293]">
                "{deletingSubject.name}"
              </p>
              <p className="mb-6 text-xs text-gray-400">
                لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingSubject(null)}
                  disabled={deleteState.isLoading}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteState.isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-600 disabled:opacity-60"
                >
                  {deleteState.isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <RefreshCcw size={14} />
                      </motion.div>
                      جاري...
                    </>
                  ) : (
                    "نعم، احذف"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
