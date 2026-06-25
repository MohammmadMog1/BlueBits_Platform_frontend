import { createBrowserRouter, RouterProvider } from "react-router";

// استيراد الـ Layouts ومصفوفات المسارات من الميزات
import MainLayout from "../../shared/layout/MainLayout/MainLayout";
import { landingRoutes } from "../../features/landing/landing.routes";
import { authRoutes } from "../../features/auth/auth.routes";
// import { studentDashboardRoutes } from "../../features/studentDashboard/student.routes";
// import { adminDashboardRoutes } from "../../features/adminDashboard/admin.routes";

const router = createBrowserRouter([
  // دمج مسارات الواجهة الرئيسية
  ...landingRoutes,

  // دمج مسارات تسجيل الدخول وإنشاء الحساب
  ...authRoutes,

  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      // ...studentDashboardRoutes,
      // ...adminDashboardRoutes,
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
