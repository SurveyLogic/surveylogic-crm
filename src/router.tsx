import { createBrowserRouter } from "react-router-dom";
import { HomeRoute } from "src/routes/HomeRoute.tsx";

import { homeRoute } from "src/constants/routes.constants.ts";
import { mainRoutes } from "src/examples/main/routes.tsx";

export const router = createBrowserRouter([
  {
    path: homeRoute,
    element: <HomeRoute />,
  },
  ...mainRoutes,
]);
