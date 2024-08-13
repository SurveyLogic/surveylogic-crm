import { HomeRoute } from "./routes/HomeRoute.tsx";
import {
  OrderCreateRoute,
  OrderDetailRoute,
  OrderGeneralTab,
  OrderListRoute,
  OrderSettingsTab,
  OrdersRoute,
} from "./routes/OrdersRoute.tsx";
import { SuppliersRoute } from "./routes/SuppliersRoute.tsx";
import { AppLayout } from "./components/AppLayout/AppLayout.tsx";
import {
  homeRoute,
  orderDetailRoute,
  ordersRoute,
  suppliersRoute,
  dashboardRoute,
  orderDetailSettingTabsRoute,
  ordersCreateRoute,
} from "./constants/routes.constants.ts";
import { DashboardRoute } from "src/examples/main/routes/DashboardRoute.tsx";

const createCrudIds = (example: string, domain: string) => {
  return {
    layout: `${example}-${domain}-layout`,
    list: `${example}-${domain}-list`,
    detail: `${example}-${domain}-detail`,
    create: `${example}-${domain}-create`,
  };
};

export const routeIds = {
  order: {
    ...createCrudIds("main", "order"),
    tabs: {
      settings: "order-settings-tab",
    },
  },
  category: createCrudIds("main", "category"),
  supplier: createCrudIds("main", "supplier"),
  dashboard: "dashboard",
};

const orderRoutes = [
  {
    id: routeIds.order.layout,
    path: ordersRoute,
    element: <OrdersRoute />,
    children: [
      {
        id: routeIds.order.list,
        index: true,
        element: <OrderListRoute />,
      },
      {
        id: routeIds.order.create,
        path: ordersCreateRoute,
        element: <OrderCreateRoute />,
      },
      {
        id: routeIds.order.detail,
        path: orderDetailRoute,
        element: <OrderDetailRoute />,
        children: [
          {
            index: true,
            element: <OrderGeneralTab />,
          },
          {
            id: routeIds.order.tabs.settings,
            path: orderDetailSettingTabsRoute,
            element: <OrderSettingsTab />,
          },
        ],
      },
    ],
  },
];

const supplierRoutes = [
  {
    id: routeIds.supplier.layout,
    path: suppliersRoute,
    element: <SuppliersRoute />,
  },
];

const dashboard = {
  id: routeIds.dashboard,
  path: dashboardRoute,
  element: <DashboardRoute />,
};

export const mainRoutes = [
  {
    path: homeRoute,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      dashboard,
      ...orderRoutes,
      ...supplierRoutes,
    ],
  },
];
