// src/app/routes/AppRouter.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { landingRoutes } from "../../features/landing/landing.routes";
import { authRoutes } from "../../features/auth/auth.routes";

import UserLayout from "../../features/user/components/UserLayout";
import AdminLayout from "../../features/admin/components/AdminLayout";
import DoctorLayout from "../../features/doctor/components/DoctorLayout";

import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
import GlobalError from "../../shared/components/ErrorBoundary/GlobalError";

import { userRoutes } from "../../features/user/user.routes";
import { adminRoutes } from "../../features/admin/admin.routes";
import { doctorRoutes } from "../../features/doctor/doctor.routes";

const router = createBrowserRouter([
  ...landingRoutes,
  ...authRoutes,

  // --- مسارات الطالب/المستخدم ---
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    // مفاتيح ترجمة لا نصوص: الراوتر يُبنى مرّة واحدة عند تحميل الوحدة،
    // فالنصّ المترجَم هنا سيتجمّد على لغة الإقلاع. GlobalError يترجم بنفسه.
    errorElement: <GlobalError messageKey="errors.userArea" />,
    children: userRoutes,
  },

  // --- مسارات الإدارة ---
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <GlobalError messageKey="errors.adminArea" />,
    children: adminRoutes,
  },

  // --- مسارات الدكتور ---
  {
    path: "/doctor",
    element: (
      <ProtectedRoute allowedRoles={["DOCTOR"]}>
        <DoctorLayout />
      </ProtectedRoute>
    ),
    errorElement: <GlobalError messageKey="errors.doctorArea" />,
    children: doctorRoutes,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
