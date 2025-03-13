import { TabStoreKey } from "src/constants/tabs.constants.ts";
import { Tabs } from "src/components/Tabs/Tabs.tsx";
import { TabbedNavigationMeta, useTabbedNavigation } from "src/lib/tabs";

import {
  homeRoute,
  productDetailRoute,
  productsListRoute,
} from "src/constants/routes.constants.ts";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { routeIds } from "src/router.tsx";

import { usePersistTabs } from "src/lib/tabs/persist.ts";
import { localStorageDriver } from "src/lib/storage/local-storage.ts";

const persistStoreKey = {
  name: "product-tabs",
  version: "1.0",
};

export function ProductsRoute() {
  const navigate = useNavigate();
  const { getTabsFromStorage, persistTabs } =
    usePersistTabs<TabbedNavigationMeta>({
      storageKey: persistStoreKey,
      storage: localStorageDriver,
    });
  const [tabs, setTabs] = useState(
    getTabsFromStorage || [
      {
        id: productsListRoute,
        title: "List",
        meta: {
          routeId: routeIds.product.list,
          path: productsListRoute,
        },
      },
    ],
  );

  const [startPinnedTabs, onStartPinnedTabsChange] = useState([
    productsListRoute,
  ]);

  const { activeTabId, setActiveTabId } = useTabbedNavigation({
    key: TabStoreKey.Products,
    onCloseAllTabs: useCallback(() => {
      navigate(homeRoute);
    }, [navigate]),
    startPinnedTabs,
    tabs,
    onTabsChange: setTabs,
    resolveTabMeta: useCallback(() => ({}), []),
  });

  useEffect(() => {
    return persistTabs(tabs);
  }, [tabs, persistTabs]);

  return (
    <div>
      <Tabs
        tabs={tabs}
        onTabsChange={setTabs}
        onStartPinnedTabsChange={onStartPinnedTabsChange}
        startPinnedTabs={startPinnedTabs}
        hasControlledActiveTabId
        activeTabId={activeTabId}
        onActiveTabIdChange={setActiveTabId}
      />
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
