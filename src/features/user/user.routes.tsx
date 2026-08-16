

// src/features/user/user.routes.tsx
import type { RouteObject } from "react-router";
import { UserLectureManager } from "./Lectures";
// import UserDashboardPage from "./pages/UserDashboardPage"; // مثال

export const userRoutes: RouteObject[] = [
  {
    index: true, // هذا يعني /user/
    element: <div>User Dashboard Placeholder</div>, // استبدلها بالمكون الحقيقي
  },
  {
    path: "lectures", // هذا يعني /user/lectures
    element: <UserLectureManager />,
  },
  // أضف باقي صفحات المستخدم هنا
];
