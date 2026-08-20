import { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  RefreshCcw,
  AlertCircle,
  X,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateUserMutation } from "../api/usersApiSlice";
import type { CreateUserPayload, User, UserRole } from "../types";
import { USER_ROLES } from "../types";

interface CreateUserModalProps {
  onClose: () => void;
  onCreated: (user: User) => void;
}

export default function CreateUserModal({ onClose, onCreated }: CreateUserModalProps) {
  const { t } = useTranslation(["users", "admin", "common"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [showPass, setShowPass] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormErr(t("create.requiredFields"));
      return;
    }

    setFormErr("");

    const payload: CreateUserPayload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    };

    try {
      const created = await createUser(payload).unwrap();
      onCreated(created);
      onClose();
    } catch {
      setFormErr(t("create.failed"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-7 pt-7 pb-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{t("create.title")}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{t("create.subtitle")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              {t("create.nameLabel")} <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("create.namePlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              {t("create.emailLabel")} <span className="text-red-400">*</span>
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="example@domain.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              {t("create.passwordLabel")} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPass ? "text" : "password"}
                placeholder={t("create.passwordPlaceholder")}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              {t("create.roleLabel")}
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="w-full appearance-none ps-4 pe-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] cursor-pointer"
              >
                {USER_ROLES.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {t(`admin:roles.${roleOption}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {formErr && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={14} className="shrink-0" /> {formErr}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              {t("common:actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-linear-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-lg shadow-[#404293]/25 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <RefreshCcw size={15} />
                  </motion.div>
                  {t("create.working")}
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} /> {t("create.submit")}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
