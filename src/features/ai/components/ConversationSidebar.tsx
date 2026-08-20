// src/features/ai/components/ConversationSidebar.tsx
import { useState } from "react";
import { Loader2, MessageSquare, SquarePen, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../shared/i18n/useFormatters";
import { useDeleteConversationMutation, useGetConversationsQuery } from "../api/aiApi";

interface ConversationSidebarProps {
  activeConversationId?: string;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
}

export default function ConversationSidebar({
  activeConversationId,
  onSelect,
  onNewConversation,
}: ConversationSidebarProps) {
  const { t } = useTranslation(["ai", "common"]);
  const { formatRelative } = useFormatters();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: conversations, isLoading } = useGetConversationsQuery();
  const [deleteConversation, { isLoading: isDeleting }] = useDeleteConversationMutation();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id).unwrap();
      if (activeConversationId === id) onNewConversation();
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <div className={`flex flex-col h-full w-full border-e ${isDark ? "border-white/8" : "border-gray-200/80"}`}>
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all ${
            isDark
              ? "bg-white/8 text-white hover:bg-white/12"
              : "bg-[#404293]/8 text-[#404293] hover:bg-[#404293]/12"
          }`}
        >
          <SquarePen className="w-4 h-4" />
          {t("sidebar.newConversation")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}

        {!isLoading && conversations?.length === 0 && (
          <div className="text-center py-10 px-4">
            <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
            <p className="text-[12px] text-gray-400">{t("sidebar.empty")}</p>
          </div>
        )}

        {conversations?.map((conv) => {
          const active = conv._id === activeConversationId;
          return (
            <div
              key={conv._id}
              onClick={() => onSelect(conv._id)}
              className={`group relative flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                active
                  ? isDark
                    ? "bg-white/10"
                    : "bg-[#404293]/8"
                  : isDark
                  ? "hover:bg-white/6"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p
                  dir="auto"
                  className={`text-[13px] font-medium truncate ${
                    active
                      ? isDark
                        ? "text-white"
                        : "text-[#404293]"
                      : isDark
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {conv.title || t("sidebar.untitled")}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatRelative(conv.updatedAt)}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDeleteId(conv._id);
                }}
                aria-label={t("sidebar.deleteConversation")}
                className={`opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 rounded-lg transition-all ${
                  isDark
                    ? "text-gray-400 hover:bg-red-500/15 hover:text-red-400"
                    : "text-gray-400 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {pendingDeleteId === conv._id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute inset-x-2 top-full mt-1 z-10 rounded-xl border p-3 shadow-xl animate-fadeIn ${
                    isDark ? "bg-[#1a1b1e] border-white/10" : "bg-white border-gray-200"
                  }`}
                >
                  <p className={`text-[12px] mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {t("sidebar.confirmDelete")}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPendingDeleteId(null)}
                      className={`flex-1 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                        isDark
                          ? "border-white/10 text-gray-300 hover:bg-white/5"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {t("common:actions.cancel")}
                    </button>
                    <button
                      onClick={() => handleDelete(conv._id)}
                      disabled={isDeleting}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 disabled:opacity-60"
                    >
                      {isDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
                      {t("common:actions.delete")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
