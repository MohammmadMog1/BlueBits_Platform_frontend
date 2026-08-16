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
import UsersManagementPage from "../users/pages/UsersManagementPage";
import { AcademicPage } from "./academic";
import SubjectManagementPage from "./subjects/pages/SubjectManagementPage";
import { LectureManagementPage } from "./lectures";

export const adminRoutes: RouteObject[] = [
  {
    index: true, // هذا يعني /admin/
    element: <div>Admin Dashboard Placeholder</div>,
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

  // أضف باقي صفحات الأدمن هنا
];
