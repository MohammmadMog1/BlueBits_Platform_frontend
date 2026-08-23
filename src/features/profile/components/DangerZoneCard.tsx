// src/features/profile/components/DangerZoneCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Trash2 } from "lucide-react";
import { useAppDispatch } from "../../../app/store/hooks";
import { useDeleteMeMutation } from "../api/profileApi";
import ConfirmModal from "./ConfirmModal";
// ⚠️ استبدلها بالـ action أو الـ thunk الموجود في auth feature عندك
import { logout } from "../../auth/redux/authSlice";

export default function DangerZoneCard() {
  const { t } = useTranslation("profile");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteMe, { isLoading }] = useDeleteMeMutation();

  const canDelete = confirmText.trim() === "DELETE";

  const handleClose = () => {
    setOpen(false);
    setConfirmText("");
  };

  const handleConfirm = async () => {
    if (!canDelete) return;
    try {
      await deleteMe().unwrap();
      dispatch(logout());
      navigate("/auth/login");
    } catch {
      // ⚠️ اعرض toast خطأ حسب نظامك
    } finally {
      handleClose();
    }
  };

  return (
    <div
      className={`rounded-2xl border shadow-sm p-6 ${
        isDark ? "bg-white/5 border-red-500/20" : "bg-white/98 border-red-200/70"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-2.5 rounded-xl flex-shrink-0 ${
            isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500"
          }`}
        >
          <Trash2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className={`text-[15px] font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            {t("dangerZone.title")}
          </h2>
          <p className="mt-1 text-[12px] text-gray-400 leading-relaxed">
            {t("dangerZone.description")}
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-[12px] font-semibold shadow-md shadow-red-500/25 hover:shadow-lg transition-all"
          >
            {t("dangerZone.deleteAccount")}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={open}
        title={t("dangerZone.confirmTitle")}
        description={t("dangerZone.confirmDescription")}
        confirmLabel={t("dangerZone.confirmLabel")}
        loading={isLoading}
        disabled={!canDelete}
        onConfirm={handleConfirm}
        onClose={handleClose}
      >
        <div>
          <label className={`text-[12px] font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {t("dangerZone.typeToConfirmPrefix")}{" "}
            <span className={`font-mono font-bold ${isDark ? "text-red-400" : "text-red-500"}`}>
              DELETE
            </span>{" "}
            {t("dangerZone.typeToConfirmSuffix")}
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className={`mt-1.5 w-full px-4 py-2.5 rounded-xl border text-[13px] font-mono outline-none focus:ring-2 focus:ring-red-500/10 transition-all ${
              isDark
                ? "border-red-500/25 bg-red-500/5 text-gray-100 focus:border-red-400/70 placeholder-gray-500"
                : "border-red-200 bg-red-50/50 text-gray-700 focus:border-red-400"
            }`}
          />
        </div>
      </ConfirmModal>
    </div>
  );
}