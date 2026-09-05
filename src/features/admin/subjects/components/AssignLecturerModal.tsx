import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { AlertCircle, GraduationCap, Loader2, UserMinus, UserPlus, X } from "lucide-react";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { fieldClass, headingClass, mutedClass } from "../../../../shared/utils/theme";
import { useGetUsersQuery } from "../../../users/api/usersApiSlice";
import { useAssignLecturerMutation, useUnassignLecturerMutation } from "../api/subjectsApi";
import { getLecturerRefId, type Subject } from "../types";

interface AssignLecturerModalProps {
  subject: Subject;
  isDark: boolean;
  onClose: () => void;
}

export default function AssignLecturerModal({ subject, isDark, onClose }: AssignLecturerModalProps) {
  const { t } = useTranslation(["admin", "common"]);
  const errorMessage = useErrorMessage();
  const [pickedDoctorId, setPickedDoctorId] = useState("");

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const [assignLecturer, assignState] = useAssignLecturerMutation();
  const [unassignLecturer, unassignState] = useUnassignLecturerMutation();

  const doctors = users.filter((user) => user.role === "DOCTOR");
  const assignedIds = (subject.lecturerIds ?? []).map(getLecturerRefId);
  const assignedDoctors = doctors.filter((doctor) => assignedIds.includes(doctor._id));
  const availableDoctors = doctors.filter((doctor) => !assignedIds.includes(doctor._id));

  const mutationError = assignState.error ?? unassignState.error;

  const handleAssign = async () => {
    if (!pickedDoctorId) return;
    try {
      await assignLecturer({ subjectId: subject._id, lecturerId: pickedDoctorId }).unwrap();
      setPickedDoctorId("");
    } catch {
      return;
    }
  };

  const handleUnassign = async (lecturerId: string) => {
    try {
      await unassignLecturer({ subjectId: subject._id, lecturerId }).unwrap();
    } catch {
      return;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-md rounded-3xl shadow-2xl ${
          isDark ? "border border-white/10 bg-[#1a1b1e]" : "bg-white"
        }`}
      >
        <div className={`px-7 pt-7 pb-5 border-b ${isDark ? "border-white/8" : "border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                  {t("subjects.lecturers.title")}
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{subject.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                isDark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-7 py-6 space-y-5">
          {mutationError && (
            <div
              className={`flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 border ${
                isDark ? "text-red-400 bg-red-500/10 border-red-500/25" : "text-red-600 bg-red-50 border-red-200"
              }`}
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMessage(mutationError)}</span>
            </div>
          )}

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {t("subjects.lecturers.assignedTitle")}
            </label>
            {usersLoading ? (
              <div className="flex items-center gap-2 py-4 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{t("common:states.loading")}</span>
              </div>
            ) : assignedDoctors.length === 0 ? (
              <p className={`text-sm ${mutedClass(isDark)}`}>{t("subjects.lecturers.noneAssigned")}</p>
            ) : (
              <ul className="space-y-2">
                {assignedDoctors.map((doctor) => (
                  <li
                    key={doctor._id}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 ${
                      isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-bold ${headingClass(isDark)}`}>{doctor.name}</p>
                      <p className={`truncate text-[11px] ${mutedClass(isDark)}`}>{doctor.email}</p>
                    </div>
                    <button
                      onClick={() => handleUnassign(doctor._id)}
                      disabled={unassignState.isLoading}
                      className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 ${
                        isDark
                          ? "text-red-400 hover:bg-red-500/10"
                          : "text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <UserMinus size={13} />
                      {unassignState.isLoading ? t("subjects.lecturers.unassigning") : t("subjects.lecturers.unassign")}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {t("subjects.lecturers.chooseDoctor")}
            </label>
            {usersLoading ? (
              <div className="flex items-center gap-2 py-4 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{t("common:states.loading")}</span>
              </div>
            ) : availableDoctors.length === 0 ? (
              <p className={`text-sm ${mutedClass(isDark)}`}>{t("subjects.lecturers.noDoctors")}</p>
            ) : (
              <div className="flex gap-2">
                <select
                  value={pickedDoctorId}
                  onChange={(event) => setPickedDoctorId(event.target.value)}
                  className={`${fieldClass(isDark)} flex-1`}
                >
                  <option value="">{t("subjects.lecturers.chooseDoctor")}</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} — {doctor.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!pickedDoctorId || assignState.isLoading}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50"
                >
                  <UserPlus size={14} />
                  {assignState.isLoading ? t("subjects.lecturers.assigning") : t("subjects.lecturers.assign")}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className={`w-full rounded-xl border py-2.5 text-sm font-bold transition-colors ${
              isDark ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t("subjects.lecturers.close")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
