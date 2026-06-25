import type{ RouteObject } from "react-router";
import { LandingPage } from "./LandingPage";

export const landingRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
];