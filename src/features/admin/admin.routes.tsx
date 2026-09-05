// import type { RouteObject } from "react-router";

// export const adminRoutes: RouteObject[] = [
//   {
//     path: "/admin",
//     // element: <AuthLayout />,
//     // children: [
//     //   {
//     //     path: "login",
//     //     element: <LoginPage />,
//     //   },
//     //   {
//     //     path: "register",
//     //     element: <RegisterPage />,
//     //   },
//     // ],
//   },

// ];

// src/features/admin/admin.routes.tsx
import type { RouteObject } from "react-router";
import { Navigate } from "react-router-dom";
import UsersManagementPage from "../users/pages/UsersManagementPage";
import { AdminDashboardPage } from "./dashboard";
import { AcademicPage } from "./academic";
import SubjectManagementPage from "./subjects/pages/SubjectManagementPage";
import { LectureManagementPage } from "./lectures";
import { QuestionBanksManagementPage } from "./questionBanks";
import { AcademicTasksManagementPage } from "./tasks";
import { AnnouncementsManagementPage } from "./announcements";
import { ScheduleGeneratorPage, ScheduleSettingsPage, SubjectGroupsManagementPage } from "./schedule";
import { SurveyFormsManagementPage, SurveyStatsPage } from "./surveys";
import { AiChatPage } from "../ai";


export const adminRoutes: RouteObject[] = [
  {
    index: true, // /admin → مسار واحد قانوني للداشبورد
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "dashboard", // هذا يعني /admin/dashboard (نفس مسار adminNavItems)
    element: <AdminDashboardPage />,
  },
  {
    path: "users", // هذا يعني /admin/users
    element: <UsersManagementPage />,
  },
  {
    path: "academic",
    element: <AcademicPage />,
  },
  {
    path: "subjects",
    element: <SubjectManagementPage />,
  },
  {
    path: "lectures",
    element: <LectureManagementPage />,
  },
  {
    path: "question-banks", // هذا يعني /admin/question-banks
    element: <QuestionBanksManagementPage />,
  },
  {
    path: "academic-tasks",
    element: <AcademicTasksManagementPage />,
  },
  {
    path: "announcements",
    element: <AnnouncementsManagementPage />,
  },
  {
    path: "surveys", // هذا يعني /admin/surveys
    element: <SurveyFormsManagementPage />,
  },
  {
    path: "survey-stats", // هذا يعني /admin/survey-stats
    element: <SurveyStatsPage />,
  },
  {
    path: "schedule-settings", // هذا يعني /admin/schedule-settings
    element: <ScheduleSettingsPage />,
  },
  {
    path: "schedule-groups", // هذا يعني /admin/schedule-groups
    element: <SubjectGroupsManagementPage />,
  },
  {
    path: "schedule-generate", // هذا يعني /admin/schedule-generate
    element: <ScheduleGeneratorPage />,
  },
  {
    path: "assistant", // هذا يعني /admin/assistant
    element: <AiChatPage />,
  },
  // أضف باقي صفحات الأدمن هنا
];
