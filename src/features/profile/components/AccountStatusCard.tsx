// src/features/profile/components/AccountStatusCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserX } from "lucide-react";
import { useAppDispatch } from "../../../app/store/hooks";
import { useActiveMeMutation } from "../api/profileApi";
import ConfirmModal from "./ConfirmModal";
// ⚠️ استبدلها بالـ action أو الـ thunk الموجود في auth feature عندك
import { logout } from "../../auth/redux/authSlice";

export default function AccountStatusCard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeMe, { isLoading }] = useActiveMeMutation();

  const handleConfirm = async () => {
    try {
      await activeMe({ active: "false" }).unwrap();
      dispatch(logout()); // تسجيل خروج فوري بعد التعطيل
      navigate("/login");
    } catch {
      // ⚠️ اعرض toast خطأ حسب نظامك
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/98 border border-gray-200/80 shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 flex-shrink-0">
          <UserX className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-[15px] font-bold text-gray-800">Deactivate Account</h2>
          <p className="mt-1 text-[12px] text-gray-400 leading-relaxed">
            Temporarily disable your account. You will be signed out immediately
            and won't be able to access the platform until reactivation.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-600 text-[12px] font-semibold hover:bg-amber-100 transition-colors"
          >
            Deactivate Account
          </button>
        </div>
      </div>

      <ConfirmModal
        open={open}
        title="Deactivate your account?"
        description="Your account will be disabled and you will be signed out immediately. Contact an administrator to reactivate it later."
        confirmLabel="Deactivate"
        loading={isLoading}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}