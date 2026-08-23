// src/features/profile/components/ProfileImageUploader.tsx
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Camera, Check, Loader2, X } from "lucide-react";
import { useUpdateMeAndUploadMutation } from "../api/profileApi";
import { getUserInitials, getProfileImageUrl } from "../../../shared/utils/user";
import type { User } from "../types/profile.types";

interface Props {
  user: User;
  onUpdated: (updated: User) => void;
}

export default function ProfileImageUploader({ user, onUpdated }: Props) {
  const { t } = useTranslation(["profile", "common"]);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [updateImage, { isLoading }] = useUpdateMeAndUploadMutation();

  const imageUrl = imageFailed ? null : getProfileImageUrl(user.profile_image);

  useEffect(() => {
    setImageFailed(false);
  }, [user.profile_image]);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
    e.target.value = ""; // للسماح باختيار نفس الصورة مجدداً
  };

  const cancelPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      const formData = new FormData();
      formData.append("profile_image", selectedFile);
      const updated = await updateImage(formData).unwrap();
      onUpdated(updated);
    } catch {
      // ⚠️ اعرض toast خطأ حسب نظامك
    } finally {
      cancelPreview();
    }
  };

  return (
    <div className="relative flex-shrink-0">
      {/* Avatar */}
      <div
        className={`w-24 h-24 rounded-full ring-4 shadow-lg overflow-hidden bg-gradient-to-r from-[#404293] to-[#2376BB] flex items-center justify-center ${
          isDark ? "ring-[#161719]" : "ring-white"
        }`}
      >
        {preview ? (
          <img src={preview} alt={t("profile:imageUploader.previewAlt")} className="w-full h-full object-cover" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="text-white text-2xl font-bold">
            {getUserInitials(user.name)}
          </span>
        )}
      </div>

      {/* زر الكاميرا */}
      {!preview && (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          title={t("profile:imageUploader.changePicture")}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md shadow-[#404293]/30 hover:scale-110 transition-transform"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </button>
      )}

      {/* أزرار الحفظ/الإلغاء عند اختيار صورة */}
      {preview && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          <button
            onClick={handleSave}
            disabled={isLoading}
            title={t("common:actions.save")}
            className="p-2 rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md hover:scale-110 transition-transform"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
          <button
            onClick={cancelPreview}
            disabled={isLoading}
            title={t("common:actions.cancel")}
            className={`p-2 rounded-full border shadow-md hover:scale-110 hover:text-red-500 transition-all ${
              isDark ? "bg-[#26272b] border-white/10 text-gray-400" : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePick}
      />
    </div>
  );
}