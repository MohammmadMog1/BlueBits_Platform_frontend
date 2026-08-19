// import type { RouteObject } from "react-router";

// export const userRoutes: RouteObject[] = [
//   {
//     path: "/user",
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

// src/features/user/user.routes.tsx
import type { RouteObject } from "react-router";
import { Navigate } from "react-router-dom";
import { AiChatPage } from "../ai";
import { UserDashboardPage } from "./dashboard";
import { StudentAnnouncementsPage } from "../studentAnnouncements";
import TasksHubPage from "./pages/TasksHubPage";
import { UserLectureManager } from "./Lectures";
import { McqPracticePage } from "./mcq";
import { SurveyPage } from "./survey";
// import UserDashboardPage from "./pages/UserDashboardPage"; // مثال

export const userRoutes: RouteObject[] = [
  {
    index: true, // /user → مسار واحد قانوني للداشبورد
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "dashboard", // هذا يعني /user/dashboard (نفس مسار userNavItems)
    element: <UserDashboardPage />,
  },
  {
    path: "todo", // هذا يعني /user/todo — يضم المهام الشخصية والأكاديمية
    element: <TasksHubPage />,
  },
  {
    path: "announcements", // هذا يعني /user/announcements
    element: <StudentAnnouncementsPage />,
  },
  {
    path: "assistant", // هذا يعني /user/assistant
    element: <AiChatPage />,
  },
  {
    path: "lectures", // هذا يعني /user/lectures
    element: <UserLectureManager />,
  },
  {
    path: "mcq", // هذا يعني /user/mcq
    element: <McqPracticePage />,
  },
  {
    path: "survey", // هذا يعني /user/survey — استبيان برنامج الفحص
    element: <SurveyPage />,
  },
  // أضف باقي صفحات المستخدم هنا
];
