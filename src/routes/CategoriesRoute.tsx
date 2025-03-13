import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import {
  categoriesListRoute,
  categoryDetailRoute,
  homeRoute,
} from "src/constants/routes.constants.ts";
import { routeIds } from "src/router.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs } from "src/components/Tabs/Tabs.tsx";
import {
  TabbedNavigationMeta,
  TabConfig,
  useTabbedNavigation2,
} from "src/lib/tabs/tabbed-navigation-2.tsx";

import { TabModel } from "src/lib/tabs";
import { usePersistTabs } from "src/lib/tabs/persist.ts";
import { localStorageDriver } from "src/lib/storage/local-storage.ts";

type DetailTabParams = { id: string };

const persistStoreKey = {
  name: "category-tabs",
  version: "1.0",
};

export function CategoriesRoute() {
  const [listTab] = useState(() => ({
    title: () => "List",
    id: categoriesListRoute,
    routeId: routeIds.category.list,
  }));

  const [detailTab] = useState<TabConfig<DetailTabParams>>(() => ({
    title: ({ params }) => `Category ${params.id}`,
    id: ({ params }) => categoryDetailRoute.replace(":id", params.id),
    routeId: routeIds.category.detail,
  }));

  const { getTabsFromStorage, persistTabs } =
    usePersistTabs<TabbedNavigationMeta>({
      storageKey: persistStoreKey,
      storage: localStorageDriver,
    });

  const defaultTabs: TabModel<TabbedNavigationMeta>[] = [
    {
      id: listTab.id,
      title: "List",
      meta: {
        routeId: listTab.id,
        path: "",
      },
    },
  ];

  const [tabs, setTabs] = useState<TabModel<TabbedNavigationMeta>[]>(
    getTabsFromStorage() || defaultTabs,
  );

  useEffect(() => {
    return persistTabs(tabs);
  }, [tabs, persistTabs]);

  const [startPinnedTabs, setStartPinnedTabsChange] = useState<string[]>([
    listTab.id,
  ]);

  const navigate = useNavigate();
  const { activeTabId, setActiveTabId } = useTabbedNavigation2({
    config: useMemo(() => [listTab, detailTab], [listTab, detailTab]),
    onCloseAllTabs: () => {
      navigate(homeRoute);
    },
    startPinnedTabs,
    tabs,
    onTabsChange: setTabs,
    resolveTabMeta: useCallback(() => ({}), []),
  });

  //const {getTabsProps} = usePersistTabs(persistStoreKey, tabs)

  return (
    <div>
      <Tabs
        activeTabId={activeTabId}
        onActiveTabIdChange={setActiveTabId}
        tabs={tabs}
        startPinnedTabs={startPinnedTabs}
        onTabsChange={setTabs}
        hasControlledActiveTabId
        onStartPinnedTabsChange={setStartPinnedTabsChange}
      />
      <Outlet />
    </div>
  );
}

export function CategoryListRoute() {
  return (
    <div>
      <ul>
        <li>
          <Link to={categoryDetailRoute.replace(":id", "1")}>Category 1</Link>
        </li>
        <li>
          <Link to={categoryDetailRoute.replace(":id", "2")}>Category 2</Link>
        </li>
      </ul>
    </div>
  );
}

export function CategoryDetailRoute() {
  const params = useParams();
  return <div>detail ${params.id}</div>;
}
