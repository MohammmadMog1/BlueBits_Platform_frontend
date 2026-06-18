import { createBrowserRouter, RouterProvider } from "react-router-dom";
//layouts
import MainLayout from "../../shared/layout/MainLayout/MainLayout";
//pages
// import Home from "@pages/Home";
// import Products from "@pages/Products";
// import Categories from "@pages/Categories";
// import AboutUs from "@pages/AboutUs";
// import Login from "@pages/Login";
// import Register from "@pages/Register";
// import Error from "@pages/Error";
import { LandingPage } from "../../features/landing";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // path: "/",
    // element: <MainLayout />,
    // errorElement: <Error />,
    // children: [
    //   {
    //     index: true,
    //     element: <Home />,
    //   },
    //   {
    //     path: "/categories/products/:prefix",
    //     element: <Products />,
    //     loader: ({ params }) => {
    //       if (
    //         typeof params.prefix !== "string" ||
    //         !/^[a-z]+$/i.test(params.prefix!)) {
    //         throw new Response("Invalid prefix", {
    //           statusText: "Category not found",
    //           status: 400,
    //         });
    //       }
    //     },
    //   },

    //   {
    //     path: "about-us",
    //     element: <AboutUs />,
    //   },
    //   {
    //     path: "login",
    //     element: <Login />,
    //   },
    //   {
    //     path: "register",
    //     element: <Register />,
    //   },
    // ],
  },
  {
    path: "LandingPage",
    element: <LandingPage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
