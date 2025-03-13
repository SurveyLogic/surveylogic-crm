import { createBrowserRouter, Params } from "react-router-dom";
import { AppLayout } from "src/components/AppLayout/AppLayout.tsx";
import {
  ProductDetailRoute,
  ProductListRoute,
  ProductsRoute,
} from "src/routes/ProductsRoute.tsx";
import {
  CategoriesRoute,
  CategoryDetailRoute,
  CategoryListRoute,
} from "src/routes/CategoriesRoute.tsx";
import { SuppliersRoute } from "src/routes/SuppliersRoute.tsx";
import { HomeRoute } from "src/routes/HomeRoute.tsx";
import { TabStoreKey } from "src/constants/tabs.constants.ts";
import * as routes from "src/constants/routes.constants.ts";

export type TabHandle = {
  key: string;
  title: (props: { params: Params }) => string;
};

export type Handle = {
  tabs: TabHandle[];
};

export const routeIds = {
  product: {
    layout: "product-layout",
    list: "product-list",
    detail: "product-detail",
  },
  category: {
    layout: "category-layout",
    list: "category-list",
    detail: "category-detail",
  },
};

const productRoutes = [
  {
    id: routeIds.product.layout,
    path: routes.productsRoute,
    element: <ProductsRoute />,
    handle: {
      tabs: [
        {
          key: TabStoreKey.Main,
          title: () => "products",
        },
      ],
    } as Handle,
    children: [
      {
        id: routeIds.product.list,
        index: true,
        element: <ProductListRoute />,
        handle: {
          tabs: [
            {
              key: TabStoreKey.Products,
              title: () => "list",
            },
          ],
        } as Handle,
      },
      {
        id: routeIds.product.detail,
        path: routes.productDetailRoute,
        element: <ProductDetailRoute />,
        handle: {
          tabs: [
            {
              key: TabStoreKey.Products,
              title: ({ params }: { params: { id: string } }) =>
                `product ${params.id}`,
            },
          ],
        } as Handle,
      },
    ],
  },
];

const categoryRoutes = [
  {
    path: routes.categoriesRoute,
    element: <CategoriesRoute />,
    id: routeIds.category.layout,
    handle: {
      tabs: [
        {
          key: TabStoreKey.Main,
          title: () => "categories",
        },
      ],
    } as Handle,
    children: [
      {
        id: routeIds.category.list,
        index: true,
        element: <CategoryListRoute />,
      },
      {
        id: routeIds.category.detail,
        path: routes.categoryDetailRoute,
        element: <CategoryDetailRoute />,
      },
    ],
  },
];

const supplierRoutes = [
  {
    path: routes.suppliersRoute,
    element: <SuppliersRoute />,
    handle: {
      tabs: [
        {
          key: TabStoreKey.Main,
          title: () => "suppliers",
        },
      ],
    } as Handle,
  },
];

export const router = createBrowserRouter([
  {
    path: routes.homeRoute,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      ...productRoutes,
      ...categoryRoutes,
      ...supplierRoutes,
    ],
  },
]);
