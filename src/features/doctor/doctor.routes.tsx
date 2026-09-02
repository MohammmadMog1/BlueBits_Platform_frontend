// src/features/doctor/doctor.routes.tsx
import type { RouteObject } from "react-router";
import { Navigate } from "react-router-dom";
import { DoctorDashboardPage } from "./dashboard";
import MySubjectsPage from "./subjects/pages/MySubjectsPage";
import DoctorLecturesPage from "./lectures/pages/DoctorLecturesPage";
import DoctorQuestionBanksPage from "./questionBanks/pages/DoctorQuestionBanksPage";

export const doctorRoutes: RouteObject[] = [
  {
    index: true, // /doctor → مسار واحد قانوني للداشبورد
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "dashboard", // /doctor/dashboard (نفس مسار doctorNavItems)
    element: <DoctorDashboardPage />,
  },
  {
    path: "subjects", // /doctor/subjects
    element: <MySubjectsPage />,
  },
  {
    path: "lectures", // /doctor/lectures
    element: <DoctorLecturesPage />,
  },
  {
    path: "question-banks", // /doctor/question-banks
    element: <DoctorQuestionBanksPage />,
  },
];
