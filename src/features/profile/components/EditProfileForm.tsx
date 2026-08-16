// src/features/profile/components/EditProfileForm.tsx
import { useEffect, useState } from "react";
import { Loader2, Save, UserRound, GraduationCap, CheckCircle2 } from "lucide-react";
import { useUpdateMeMutation } from "../api/profileApi";
import { useGetYearsQuery } from "../../admin/academic/api/academicApi";
import type { User } from "../types/profile.types";

interface Props {
  user: User;
  onUpdated: (updated: User) => void;
}

export default function EditProfileForm({ user, onUpdated }: Props) {
  const [name, setName] = useState(user.name);
  const [yearId, setYearId] = useState(user.yearId ?? "");
  const [saved, setSaved] = useState(false);
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const { data: years } = useGetYearsQuery();

  useEffect(() => {
    setName(user.name);
    setYearId(user.yearId ?? "");
  }, [user.name, user.yearId]);

  const isDirty = name !== user.name || yearId !== (user.yearId ?? "");
  const isValid = name.trim().length >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !isDirty) return;
    try {
      const updated = await updateMe({
        name: name.trim(),
        ...(yearId ? { yearId } : {}),
      }).unwrap();
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // ⚠️ toast خطأ
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/98 border border-gray-200/80 shadow-sm p-6"
    >
      <h2 className="text-[15px] font-bold text-gray-800">Edit Profile</h2>
      <p className="text-[12px] text-gray-400 mt-0.5">Update your personal information</p>

      <div className="mt-5 space-y-4">
        {/* Name */}
        <div>
          <label className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-600 mb-1.5">
            <UserRound className="w-3.5 h-3.5" /> Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[13px] text-gray-700 outline-none focus:border-[#404293]/40 focus:bg-white focus:ring-2 focus:ring-[#404293]/10 transition-all"
          />
        </div>

        {/* Year */}
        {years && years.length > 0 && (
          <div>
            <label className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-600 mb-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> Academic Year
            </label>
            <select
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[13px] text-gray-700 outline-none focus:border-[#404293]/40 focus:bg-white focus:ring-2 focus:ring-[#404293]/10 transition-all"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y._id} value={y._id}>{y.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={!isDirty || !isValid || isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-[13px] font-semibold flex items-center gap-2 shadow-md shadow-[#404293]/25 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>

        {saved && (
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" /> Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}