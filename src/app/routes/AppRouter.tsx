import { createBrowserRouter, RouterProvider } from "react-router-dom";

// استيراد الـ Layouts ومصفوفات المسارات من الميزات
import MainLayout from "../../shared/layout/MainLayout/MainLayout";
import { landingRoutes } from "../../features/landing/landing.routes";
import { authRoutes } from "../../features/auth/auth.routes";
import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
import GlobalError from "../../shared/components/ErrorBoundary/GlobalError";
// import { studentDashboardRoutes } from "../../features/studentDashboard/student.routes";
// import { adminDashboardRoutes } from "../../features/adminDashboard/admin.routes";

const router = createBrowserRouter([
  // دمج مسارات الواجهة الرئيسية
  ...landingRoutes,

  // دمج مسارات تسجيل الدخول وإنشاء الحساب
  ...authRoutes,

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: (
      <GlobalError
        title="Page not found"
        message="The page you are looking for does not exist."
      />
    ),
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
