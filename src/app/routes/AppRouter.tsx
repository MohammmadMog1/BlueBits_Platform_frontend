import { createBrowserRouter, RouterProvider } from "react-router-dom";
// layouts
import MainLayout from "../../shared/layout/MainLayout/MainLayout";
// auth pages
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import VerifyPage from "../../features/auth/pages/VerifyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "verify",
        element: <VerifyPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
