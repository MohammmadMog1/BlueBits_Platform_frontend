import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  FileText,
  Clock,
  File,
  Download,
  Eye,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { LecturePopulated } from "../types";

export function AdminLectureCard({
  lec,
  onDelete,
  onDownload,
  onView,
  onToggleStatus,
  onRename,
}: {
  lec: LecturePopulated;
  onDelete: () => void;
  onDownload: () => void;
  onView: () => void;
  onToggleStatus: () => void;
  onRename: (title: string) => void;
}) {
  const { t } = useTranslation("admin");
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(lec.title);

  const confirmRename = () => {
    if (!draft.trim()) return;
    onRename(draft.trim());
    setRenaming(false);
  };

  const isPractical = lec.type === "practical";

  // ✅ تم إصلاح: إزالة lec.date لأنها غير موجودة في الـ Type
  // ✅ تم إضافة: تنسيق التاريخ بشكل مقروء
  const formattedDate = new Date(lec.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // ✅ تم إصلاح: إزالة downloads و views لأنها غير موجودة في الـ API
  // إذا أردت إضافتها لاحقاً، يجب تحديث الـ Lecture type أولاً

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#404293]/8 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      <div
        className={`h-1 w-full ${
          isPractical
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : "bg-gradient-to-r from-[#404293] to-[#2376BB]"
        }`}
      />
      <div className="flex flex-col sm:flex-row gap-4 p-5">
        <div className="relative flex-shrink-0 self-start">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
              isPractical
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200/60"
                : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-200/60"
            }`}
          >
            <FileText className="w-7 h-7 text-white" />
          </div>
          <span
            className={`absolute -bottom-1 -end-1 text-[8px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm ${
              isPractical ? "bg-emerald-500" : "bg-[#404293]"
            }`}
          >
            {isPractical
              ? t("lectureManagement.card.labBadge")
              : t("lectureManagement.card.pdfBadge")}
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {renaming ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename();
                  if (e.key === "Escape") setRenaming(false);
                }}
                className="flex-1 text-sm font-bold text-gray-900 border-b-2 border-[#404293] bg-transparent outline-none pb-0.5 min-w-0"
              />
              <button
                onClick={confirmRename}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#404293] text-white font-bold hover:bg-[#33529F] transition-colors flex-shrink-0"
              >
                <CheckCircle2 size={11} /> {t("lectureManagement.card.save")}
              </button>
              <button
                onClick={() => {
                  setDraft(lec.title);
                  setRenaming(false);
                }}
                className="text-[11px] text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <h4
              className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#404293] transition-colors line-clamp-2 cursor-pointer"
              onDoubleClick={() => setRenaming(true)}
            >
              {lec.title}
            </h4>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1 font-medium">
              <Clock size={11} className="text-gray-300" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <File size={11} className="text-gray-300" />{" "}
              {isPractical
                ? t("lectureManagement.types.practical")
                : t("lectureManagement.types.theoretical")}
            </span>
            {/* ✅ تم إضافة حجم الملف بدلاً من downloads/views */}
            <span className="flex items-center gap-1 font-medium">
              <Download size={11} className="text-[#2376BB]/60" />
              <span className="text-[#2376BB] font-bold">
                {(lec.fileSize / 1024 / 1024).toFixed(2)} MB
              </span>
            </span>
          </div>
          <p className="text-[10px] text-gray-300 italic hidden sm:block">
            {t("lectureManagement.card.renameHint")}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2.5 flex-shrink-0 pt-1">
          <button
            onClick={onToggleStatus}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              lec.isPublished
                ? "bg-green-500/10 border-green-500/25 text-green-600 hover:bg-green-500/20"
                : "bg-amber-500/10 border-amber-500/25 text-amber-600 hover:bg-amber-500/20"
            }`}
          >
            {lec.isPublished ? (
              <>
                <ToggleRight size={13} /> {t("lectureManagement.card.published")}
              </>
            ) : (
              <>
                <ToggleLeft size={13} /> {t("lectureManagement.card.draft")}
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={onView}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 border border-transparent hover:border-[#404293]/15 transition-all"
            >
              <Eye size={12} /> {t("lectureManagement.card.view")}
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 border border-transparent hover:border-[#404293]/15 transition-all"
            >
              <Download size={12} /> {t("lectureManagement.card.download")}
            </button>
            <button
              onClick={() => setRenaming(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 border border-transparent hover:border-[#404293]/15 transition-all"
            >
              <Edit3 size={12} /> {t("lectureManagement.card.rename")}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
            >
              <Trash2 size={12} /> {t("lectureManagement.card.delete")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}