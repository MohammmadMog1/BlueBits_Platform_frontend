// src/app/routes/AppRouter.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { landingRoutes } from "../../features/landing/landing.routes";
import { authRoutes } from "../../features/auth/auth.routes";

import UserLayout from "../../features/user/components/UserLayout";
import AdminLayout from "../../features/admin/components/AdminLayout";

import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
import GlobalError from "../../shared/components/ErrorBoundary/GlobalError";

import { userRoutes } from "../../features/user/user.routes";
import { adminRoutes } from "../../features/admin/admin.routes";


// استيراد النوع فقط للتحقق (لن نستخدمه كقيمة)
// import type { UserRole } from "../../features/auth/types/auth.types"; 

const router = createBrowserRouter([
  ...landingRoutes,
  ...authRoutes,

  // --- مسارات الطالب/المستخدم ---
  {
    path: "/user", 
    element: (
      // ✅ الحل: استخدم النصوص الحرفية المطابقة للـ Type
      <ProtectedRoute >
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: <GlobalError title="خطأ" message="حدث خطأ في منطقة المستخدم." />,
    children: userRoutes, 
  },

  // --- مسارات الإدارة ---
  {
    path: "/admin",
    element: (
      // ✅ الحل: استخدم النصوص الحرفية المطابقة للـ Type
      <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <GlobalError title="خطأ" message="حدث خطأ في منطقة الإدارة." />,
    children: adminRoutes, 
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// // استيراد الـ Layouts ومصفوفات المسارات من الميزات
// import MainLayout from "../../shared/layout/MainLayout/MainLayout";
// import { landingRoutes } from "../../features/landing/landing.routes";
// import { authRoutes } from "../../features/auth/auth.routes";
// import { adminRoutes } from "../../features/admin/admin.routes";
// import { userRoutes } from "../../features/user/user.routes";
// import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
// import GlobalError from "../../shared/components/ErrorBoundary/GlobalError";
// // import { studentDashboardRoutes } from "../../features/studentDashboard/student.routes";
// // import { adminDashboardRoutes } from "../../features/adminDashboard/admin.routes";

// const router = createBrowserRouter([
//   // دمج مسارات الواجهة الرئيسية
//   ...landingRoutes,

//   // دمج مسارات تسجيل الدخول وإنشاء الحساب
//   ...authRoutes,

//   ...userRoutes,
//   ...adminRoutes,

//   {
//     path: "/dashboard",
//     element: (
//       <ProtectedRoute>
//         <MainLayout />
//       </ProtectedRoute>
//     ),
//     errorElement: (
//       <GlobalError
//         title="Page not found"
//         message="The page you are looking for does not exist."
//       />
//     ),
//     children: [
//       // ...studentDashboardRoutes,
//       // ...adminDashboardRoutes,
//     ],
//   },
// ]);

// const AppRouter = () => {
//   return <RouterProvider router={router} />;
// };

// export default AppRouter;
