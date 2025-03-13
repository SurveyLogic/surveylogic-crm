import { createBrowserRouter } from "react-router-dom";
import { HomeRoute } from "src/routes/HomeRoute.tsx";

import { basicExampleRoutes } from "src/examples/basic/routes.tsx";
import { homeRoute } from "src/constants/routes.constants.ts";
import { clipOneRoutes } from "src/examples/clip-one/routes.tsx";

export const router = createBrowserRouter([
  {
    path: homeRoute,
    element: <HomeRoute />,
  },
  ...basicExampleRoutes,
  ...clipOneRoutes,
]);
