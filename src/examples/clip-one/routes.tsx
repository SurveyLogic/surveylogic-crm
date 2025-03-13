import { HomeRoute } from "./routes/HomeRoute.tsx";
import {
  ProductDetailRoute,
  ProductListRoute,
  ProductsRoute,
} from "./routes/ProductsRoute.tsx";
import {
  CategoriesRoute,
  CategoryDetailRoute,
  CategoryListRoute,
} from "./routes/CategoriesRoute.tsx";
import { SuppliersRoute } from "./routes/SuppliersRoute.tsx";
import { AppLayout } from "./components/AppLayout/AppLayout.tsx";
import {
  homeRoute,
  categoriesRoute,
  categoryDetailRoute,
  productDetailRoute,
  productsRoute,
  suppliersRoute,
  dashboardRoute,
} from "./constants/routes.constants.ts";
import { DashboardRoute } from "src/examples/clip-one/routes/DashboardRoute.tsx";

const createCrudIds = (example: string, domain: string) => {
  return {
    layout: `${example}-${domain}-layout`,
    list: `${example}-${domain}-list`,
    detail: `${example}-${domain}-detail`,
  };
};

export const routeIds = {
  product: createCrudIds("clip-one", "product"),
  category: createCrudIds("clip-one", "category"),
  supplier: createCrudIds("clip-one", "supplier"),
  dashboard: "dashboard",
};

const productRoutes = [
  {
    id: routeIds.product.layout,
    path: productsRoute,
    element: <ProductsRoute />,
    children: [
      {
        id: routeIds.product.list,
        index: true,
        element: <ProductListRoute />,
      },
      {
        id: routeIds.product.detail,
        path: productDetailRoute,
        element: <ProductDetailRoute />,
      },
    ],
  },
];

const categoryRoutes = [
  {
    path: categoriesRoute,
    element: <CategoriesRoute />,
    id: routeIds.category.layout,
    children: [
      {
        id: routeIds.category.list,
        index: true,
        element: <CategoryListRoute />,
      },
      {
        id: routeIds.category.detail,
        path: categoryDetailRoute,
        element: <CategoryDetailRoute />,
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

export const clipOneRoutes = [
  {
    path: homeRoute,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      dashboard,
      ...productRoutes,
      ...categoryRoutes,
      ...supplierRoutes,
    ],
  },
];
