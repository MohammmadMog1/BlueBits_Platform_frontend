// src/features/profile/components/EditProfileForm.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Loader2, Save, UserRound, GraduationCap, CheckCircle2 } from "lucide-react";
import { useUpdateMeMutation } from "../api/profileApi";
import { useGetYearsQuery } from "../../admin/academic/api/academicApi";
import type { User } from "../types/profile.types";

interface Props {
  user: User;
  onUpdated: (updated: User) => void;
}

export default function EditProfileForm({ user, onUpdated }: Props) {
  const { t } = useTranslation(["profile", "common"]);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [name, setName] = useState(user.name);
  const [yearId, setYearId] = useState(user.yearId ?? "");
  const [saved, setSaved] = useState(false);
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  const { data: years, isLoading: yearsLoading } = useGetYearsQuery();

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
      className={`rounded-2xl border shadow-sm p-6 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white/98 border-gray-200/80"
      }`}
    >
      <h2 className={`text-[15px] font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
        {t("editForm.title")}
      </h2>
      <p className="text-[12px] text-gray-400 mt-0.5">{t("editForm.subtitle")}</p>

      <div className="mt-5 space-y-4">
        {/* Name */}
        <div>
          <label
            className={`flex items-center gap-1.5 text-[12px] font-semibold mb-1.5 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <UserRound className="w-3.5 h-3.5" /> {t("editForm.nameLabel")}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("editForm.namePlaceholder")}
            className={`w-full px-4 py-2.5 rounded-xl border text-[13px] outline-none focus:border-[#404293]/40 focus:ring-2 focus:ring-[#404293]/10 transition-all ${
              isDark
                ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-500 focus:bg-white/10"
                : "border-gray-200 bg-gray-50 text-gray-700 focus:bg-white"
            }`}
          />
        </div>

        {/* Year */}
        <div>
          <label
            className={`flex items-center gap-1.5 text-[12px] font-semibold mb-1.5 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> {t("editForm.yearLabel")}
          </label>
          <select
            value={yearId}
            onChange={(e) => setYearId(e.target.value)}
            disabled={yearsLoading}
            className={`w-full px-4 py-2.5 rounded-xl border text-[13px] outline-none transition-all focus:border-[#404293]/40 focus:ring-2 focus:ring-[#404293]/10 disabled:opacity-60 ${
              isDark
                ? "border-white/10 bg-white/5 text-gray-100 focus:bg-white/10"
                : "border-gray-200 bg-gray-50 text-gray-700 focus:bg-white"
            }`}
          >
            {yearsLoading ? (
              <option value="" className={isDark ? "bg-[#1a1b1e] text-gray-100" : ""}>
                {t("common:states.loading")}
              </option>
            ) : (
              <>
                <option value="" className={isDark ? "bg-[#1a1b1e] text-gray-100" : ""}>
                  {t("editForm.selectYear")}
                </option>
                {(years ?? []).map((y) => (
                  <option key={y._id} value={y._id} className={isDark ? "bg-[#1a1b1e] text-gray-100" : ""}>
                    {y.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={!isDirty || !isValid || isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-[13px] font-semibold flex items-center gap-2 shadow-md shadow-[#404293]/25 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {t("editForm.saveChanges")}
        </button>

        {saved && (
          <span
            className={`flex items-center gap-1.5 text-[12px] font-semibold animate-fadeIn ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> {t("editForm.savedSuccess")}
          </span>
        )}
      </div>
    </form>
  );
}