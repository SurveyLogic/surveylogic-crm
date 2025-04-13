import { HomeRoute } from "./routes/HomeRoute.tsx";
import {
  OrderCreateRoute,
  OrderDetailRoute,
  OrderGeneralTab,
  OrderListRoute,
  OrderSettingsTab,
  OrdersRoute,

//custom imports
OrderCompanyTab,
OrderItemsTab,
OrderTotalsTab,
OrderPaymentsTab,
OrderProductionTab,
OrderPartsTab,
OrderNotesTab,
OrderActivitiesTab,
OrderArtworkTab,
OrderDocumentTab,
OrderShippingTab,
OrderUserDefinedFieldsTab,
OrderAdvancedTab,

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
          //custom routes
          {
            id: routeIds.order.tabs.company,
            path: orderDetailCompanyTabsRoute,
            element: <OrderCompanyTab />,
          },
          {
            id: routeIds.order.tabs.items,
            path: orderDetailItemsTabsRoute,
            element: <OrderItemsTab />,
          },
          {
            id: routeIds.order.tabs.totals,
            path: orderDetailTotalsTabsRoute,
            element: <OrderTotalsTab />,
          },
          {
            id: routeIds.order.tabs.payments,
            path: orderDetailPaymentsTabsRoute,
            element: <OrderPaymentsTab />,
          },
          {
            id: routeIds.order.tabs.production,
            path: orderDetailProductionTabsRoute,
            element: <OrderProductionTab />,
          },
          {
            id: routeIds.order.tabs.parts,
            path: orderDetailPartsTabsRoute,
            element: <OrderPartsTab />,
          },
          {
            id: routeIds.order.tabs.notes,
            path: orderDetailNotesTabsRoute,
            element: <OrderNotesTab />,
          },
          {
            id: routeIds.order.tabs.activities,
            path: orderDetailActivitiesTabsRoute,
            element: <OrderActivitiesTab />,
          },
          {
            id: routeIds.order.tabs.artwork,
            path: orderDetailArtworkTabsRoute,
            element: <OrderArtworkTab />,
          },
          {
            id: routeIds.order.tabs.documents,
            path: orderDetailDocumentsTabsRoute,
            element: <OrderDocumentsTab />,
          },
          {
            id: routeIds.order.tabs.shipping,
            path: orderDetailShippingTabsRoute,
            element: <OrderShippingTab />,
          },
          {
            id: routeIds.order.tabs.userdefinedfields,
            path: orderDetailUserDefinedFieldsTabsRoute,
            element: <OrderUserDefinedFieldsTab />,
          },
          {
            id: routeIds.order.tabs.advanced,
            path: orderDetailAdvancedTabsRoute,
            element: <OrderAdvancedTab />,
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
