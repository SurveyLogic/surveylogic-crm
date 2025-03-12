import { TabStoreKey } from "src/constants/tabs.constants.ts";
import { Tabs } from "src/components/Tabs/Tabs.tsx";
import { useTabbedNavigation } from "src/lib/tabs";

import {
  homeRoute,
  productDetailRoute,
  productsListRoute,
} from "src/constants/routes.constants.ts";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import { routeIds } from "src/router.tsx";

export function ProductsRoute() {
  const navigate = useNavigate();
  const { getTabsProps } = useTabbedNavigation({
    key: TabStoreKey.Products,
    onCloseAllTabs: () => {
      navigate(homeRoute);
    },
    initialStartPinnedTabs: [productsListRoute],
    initialTabs: [
      {
        id: productsListRoute,
        key: TabStoreKey.Products,
        title: "List",
        meta: {
          routeId: routeIds.product.list,
          path: productsListRoute,
        },
      },
    ],
    resolveTabMeta: useCallback(() => ({}), []),
  });

  return (
    <div>
      <Tabs {...getTabsProps()} />
      <Outlet />
    </div>
  );
}

export function ProductListRoute() {
  return (
    <div>
      <ul>
        <li>
          <Link to={productDetailRoute.replace(":id", "1")}>Product 1</Link>
        </li>
        <li>
          <Link to={productDetailRoute.replace(":id", "2")}>Product 2</Link>
        </li>
      </ul>
    </div>
  );
}

export function ProductDetailRoute() {
  const params = useParams();
  return <div>detail ${params.id}</div>;
}
