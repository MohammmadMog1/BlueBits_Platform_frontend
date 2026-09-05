// src/features/user/questionBanks/pages/UserQuestionBanksPage.tsx
import { Navigate } from "react-router-dom";
import { QuestionBanksManagementPage, useQuestionBankPermissions } from "../../../admin/questionBanks";

export default function UserQuestionBanksPage() {
  const permissions = useQuestionBankPermissions();
  const hasAccess = permissions.canCreate || permissions.canUpdateQuestion || permissions.canDeleteQuestion;

  if (!hasAccess) return <Navigate to="/user/dashboard" replace />;

  return <QuestionBanksManagementPage />;
}
