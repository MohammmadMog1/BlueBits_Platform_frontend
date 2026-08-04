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
// import UserDashboardPage from "./pages/UserDashboardPage"; // مثال

export const userRoutes: RouteObject[] = [
  {
    index: true, // هذا يعني /user/
    element: <div>User Dashboard Placeholder</div>, // استبدلها بالمكون الحقيقي
  },
  {
    path: "lectures", // هذا يعني /user/lectures
    element: <div>Lectures Page Placeholder</div>,
  },
  // أضف باقي صفحات المستخدم هنا
];
