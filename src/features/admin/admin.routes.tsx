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

export const adminRoutes: RouteObject[] = [
  {
    index: true, // هذا يعني /admin/
    element: <div>Admin Dashboard Placeholder</div>,
  },
  {
    path: "users", // هذا يعني /admin/users
    element: <UsersManagementPage />,
  },
  // أضف باقي صفحات الأدمن هنا
];