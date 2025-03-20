import { Outlet, useNavigate, useParams } from "react-router-dom";

import { routeIds } from "../routes.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs } from "../components/Tabs/Tabs.tsx";
import {
  InsertMethod,
  TabbedNavigationMeta,
  TabConfig,
  useTabbedNavigation2,
} from "src/lib/tabs/tabbed-navigation-2.tsx";
import { data as categories } from "../data/categories.json";

import { TabModel } from "src/lib/tabs";
import { usePersistTabs } from "src/lib/tabs/persist.tsx";
import { localStorageDriver } from "src/lib/storage/local-storage.ts";
import { validateTabs } from "src/lib/tabs";
import { useDataRouterContext } from "src/hooks/useDataRouterContext.tsx";
import {
  homeRoute,
  categoriesListRoute,
  categoryDetailRoute,
} from "../constants/routes.constants.ts";
import { css } from "@emotion/react";
import { Table } from "src/examples/clip-one/components/Table/Table.tsx";

type DetailTabParams = { id: string };

const persistStoreKey = {
  name: "clip-one__category-tabs",
  version: "1.0",
};

export function CategoriesRoute() {
  const { router } = useDataRouterContext();
  const [listTabDef] = useState(() => ({
    title: () => "All Categories",
    id: categoriesListRoute,
    routeId: routeIds.category.list,
    insertMethod: InsertMethod.Prepend,
  }));

  const [detailTabDef] = useState<TabConfig<DetailTabParams>>(() => ({
    title: ({ params }) => {
      const category = categories.find(
        (category) => String(category.id) == params.id,
      );
      return category!.title;
    },
    id: ({ params }) => categoryDetailRoute.replace(":id", params.id),
    routeId: routeIds.category.detail,
    insertMethod: InsertMethod.Prepend,
  }));

  const { getTabsFromStorage, persistTabs } =
    usePersistTabs<TabbedNavigationMeta>({
      storageKey: persistStoreKey,
      storage: localStorageDriver,
    });

  const defaultTabs: TabModel<TabbedNavigationMeta>[] = [
    {
      id: listTabDef.id,
      title: "List",
      content: <Outlet />,
      meta: {
        routeId: listTabDef.id,
        path: "",
      },
    },
  ];

  const [tabs, setTabs] = useState<TabModel<TabbedNavigationMeta>[]>(() =>
    validateTabs(getTabsFromStorage() || defaultTabs, router.routes.slice()),
  );

  useEffect(() => {
    return persistTabs(tabs);
  }, [tabs, persistTabs]);

  const [startPinnedTabs, setStartPinnedTabsChange] = useState<string[]>([
    listTabDef.id,
  ]);

  const [endPinnedTabs] = useState<string[]>([]);

  const navigate = useNavigate();
  const { activeTabId, setActiveTabId } = useTabbedNavigation2({
    config: useMemo(
      () => [listTabDef, detailTabDef],
      [listTabDef, detailTabDef],
    ),
    onCloseAllTabs: () => {
      navigate(homeRoute);
    },
    endPinnedTabs,
    startPinnedTabs,
    tabs,
    onTabsChange: setTabs,
    resolveTabMeta: useCallback(() => ({}), []),
  });

  return (
    <div css={layoutStyles}>
      <Tabs
        activeTabId={activeTabId}
        onActiveTabIdChange={setActiveTabId}
        tabs={tabs}
        startPinnedTabs={startPinnedTabs}
        initialActiveTabId={activeTabId}
        initialTabs={tabs}
        initialStartPinnedTabs={startPinnedTabs}
        onTabsChange={setTabs}
        hasControlledActiveTabId
        onStartPinnedTabsChange={setStartPinnedTabsChange}
      />
    </div>
  );
}

export function CategoryListRoute() {
  const navigate = useNavigate();
  // const apiRef = useTabsApiRefContext();
  // const { parentTabsApi } = apiRef?.current.getState() || {};
  // console.log(parentTabsApi?.getActiveTab());

  return (
    <div>
      <Table
        rows={categories}
        onRowClick={(row) => {
          navigate(categoryDetailRoute.replace(":id", String(row.id)));
        }}
        columns={[
          {
            field: "id",
            name: "ID",
            width: 40,
          },
          {
            field: "title",
            name: "Title",
            width: 100,
          },
        ]}
      />
    </div>
  );
}

const layoutStyles = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export function CategoryDetailRoute() {
  const params = useParams();
  return <div>category {params.id}</div>;
}
