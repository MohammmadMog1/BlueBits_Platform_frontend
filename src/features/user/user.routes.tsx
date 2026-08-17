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
import { AiChatPage } from "../ai";
import { StudentAnnouncementsPage } from "../studentAnnouncements";
import TasksHubPage from "./pages/TasksHubPage";
import { UserLectureManager } from "./Lectures";
// import UserDashboardPage from "./pages/UserDashboardPage"; // مثال

export const userRoutes: RouteObject[] = [
  {
    index: true, // هذا يعني /user/
    element: <div>User Dashboard Placeholder</div>, // استبدلها بالمكون الحقيقي
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
  // أضف باقي صفحات المستخدم هنا
];
