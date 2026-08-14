// src/features/profile/components/DangerZoneCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useAppDispatch } from "../../../app/store/hooks";
import { useDeleteMeMutation } from "../api/profileApi";
import ConfirmModal from "./ConfirmModal";
// ⚠️ استبدلها بالـ action أو الـ thunk الموجود في auth feature عندك
import { logout } from "../../auth/redux/authSlice";

export default function DangerZoneCard() {
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
    <div className="rounded-2xl bg-white/98 border border-red-200/70 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-red-50 text-red-500 flex-shrink-0">
          <Trash2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-[15px] font-bold text-gray-800">Danger Zone</h2>
          <p className="mt-1 text-[12px] text-gray-400 leading-relaxed">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-[12px] font-semibold shadow-md shadow-red-500/25 hover:shadow-lg transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>

      <ConfirmModal
        open={open}
        title="Delete account permanently?"
        description="All your data, progress and files will be permanently removed. This cannot be undone."
        confirmLabel="Delete Forever"
        loading={isLoading}
        disabled={!canDelete}
        onConfirm={handleConfirm}
        onClose={handleClose}
      >
        <div>
          <label className="text-[12px] font-semibold text-gray-600">
            Type <span className="font-mono font-bold text-red-500">DELETE</span> to confirm
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/50 text-[13px] font-mono text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/10 transition-all"
          />
        </div>
      </ConfirmModal>
    </div>
  );
}