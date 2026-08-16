import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Users, Plus, RefreshCcw, AlertCircle } from "lucide-react";
import CreateUserModal from "../components/CreateUserModal";
import UsersFilter from "../components/UsersFilter";
import UsersStats from "../components/UsersStats";
import UsersTable from "../components/UsersTable";
import {
  useDeleteUserMutation,
  useGetUsersByYearQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "../api/usersApiSlice";
import { useGetYearsQuery } from "../../admin/academic/api/academicApi";
import type { User } from "../types";

const toastDuration = 3000;

export default function UsersManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const { data: years = [] } = useGetYearsQuery();

  const {
    data: allUsers = [],
    isLoading: isLoadingAllUsers,
    refetch: refetchAllUsers,
    error: allUsersError,
  } = useGetUsersQuery(undefined, { skip: !!yearFilter });

  const {
    data: usersByYear = [],
    isLoading: isLoadingUsersByYear,
    refetch: refetchUsersByYear,
    error: usersByYearError,
  } = useGetUsersByYearQuery(yearFilter, { skip: !yearFilter });

  const users = yearFilter ? usersByYear : allUsers;
  const isLoading = yearFilter ? isLoadingUsersByYear : isLoadingAllUsers;
  const error = yearFilter ? usersByYearError : allUsersError;
  const refetch = yearFilter ? refetchUsersByYear : refetchAllUsers;

  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), toastDuration);
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await updateUserRole({ id, role: newRole as User["role"] }).unwrap();
      showToast("تم تحديث الدور ✓", "success");
    } catch {
      showToast("فشل تحديث الدور. حاول مرة أخرى.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteUser(id).unwrap();
      showToast("تم حذف المستخدم", "success");
    } catch {
      showToast("فشل حذف المستخدم. حاول مرة أخرى.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const stats = [
    { label: "إجمالي المستخدمين", value: users.length, color: "#404293" },
    { label: "USER", value: users.filter((user) => user.role === "USER").length, color: "#2376BB" },
    { label: "DOCTOR", value: users.filter((user) => user.role === "DOCTOR").length, color: "#7c3aed" },
    { label: "مُوثّقون", value: users.filter((user) => user.isVerified !== false).length, color: "#059669" },
  ];

  const deletingUser = users.find((user) => user._id === deletingId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
              <Users className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">إدارة المستخدمين</h1>
          </div>
          <p className="text-sm text-gray-400 font-medium">عرض وإنشاء وتعديل حسابات المستخدمين</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => refetch()}
            title="تحديث"
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#404293] hover:border-[#404293]/30 shadow-sm transition-all"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-xl shadow-[#404293]/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
          >
            <Plus size={17} /> مستخدم جديد
          </button>
        </div>
      </div>

      <UsersStats stats={stats} />

      <UsersFilter
        search={search}
        roleFilter={roleFilter}
        yearFilter={yearFilter}
        years={years}
        onSearchChange={setSearch}
        onRoleChange={setRoleFilter}
        onYearChange={setYearFilter}
        onClearFilter={() => setSearch("")}
      />

      {error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 text-amber-700 text-sm font-semibold"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          تعذّر الاتصال بالخادم — حاول إعادة التحميل
        </motion.div>
      ) : null}

      <UsersTable
        users={users}
        search={search}
        roleFilter={roleFilter}
        loading={isLoading}
        onRoleChange={handleRoleChange}
        onDelete={setDeletingId}
      />

      <AnimatePresence>
        {showCreate && (
          <CreateUserModal
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              showToast("تم إنشاء الحساب بنجاح ✓", "success");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-400 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">تأكيد الحذف</h3>
                <p className="text-sm text-gray-500 mt-1">هل تريد حذف المستخدم {deletingUser?.name || "؟"}</p>
              </div>
              <div className="px-6 py-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => deletingId && handleDelete(deletingId)}
                  className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/15 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  disabled={isDeleting}
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-500 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {toast.msg}
        </motion.div>
      ) : null}
    </div>
  );
}
