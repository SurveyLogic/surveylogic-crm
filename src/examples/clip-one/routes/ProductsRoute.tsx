import { Tabs } from "../components/Tabs/Tabs.tsx";
import { TabbedNavigationMeta } from "src/lib/tabs";

import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { routeIds } from "../routes.tsx";
import { data as products } from "../data/products.json";

import { usePersistTabs } from "src/lib/tabs/persist.ts";
import { localStorageDriver } from "src/lib/storage/local-storage.ts";
import { validateTabs } from "src/lib/tabs";
import { useDataRouterContext } from "src/hooks/useDataRouterContext.tsx";
import {
  homeRoute,
  productDetailRoute,
  productDetailSettingTabsRoute,
  productsCreateRoute,
  productsListRoute,
} from "../constants/routes.constants.ts";
import {
  InsertMethod,
  useTabbedNavigation2,
} from "src/lib/tabs/tabbed-navigation-2.tsx";
import { css } from "@emotion/react";
import { Table } from "src/examples/clip-one/components/Table/Table.tsx";
import { Button } from "src/examples/clip-one/components/Button/Button.tsx";

type DetailParams = { id: string };

const persistStoreKey = {
  name: "clip-one__product-tabs",
  version: "1.0",
};

export function ProductsRoute() {
  const navigate = useNavigate();
  const { router } = useDataRouterContext();
  const { getTabsFromStorage, persistTabs } =
    usePersistTabs<TabbedNavigationMeta>({
      storageKey: persistStoreKey,
      storage: localStorageDriver,
    });

  const [listTab] = useState(() => ({
    id: productsListRoute,
    title: "All products",
    meta: {
      routeId: routeIds.product.list,
      path: productsListRoute,
    },
  }));

  const [detailTabDefinition] = useState(() => ({
    title: ({ params }: { params: DetailParams }) => {
      const product = products.find(
        (product) => String(product.id) === params.id,
      );
      return product!.title;
    },
    id: ({ params }: { params: DetailParams }) =>
      productDetailRoute.replace(":id", params.id),
    routeId: routeIds.product.detail,
    insertMethod: InsertMethod.Prepend,
  }));

  const [listTabDefinition] = useState(() => ({
    title: () => listTab.title,
    id: listTab.id,
    routeId: listTab.meta.routeId,
    insertMethod: InsertMethod.Prepend,
  }));

  const [createTabDefinition] = useState(() => ({
    title: () => "New product",
    id: productsCreateRoute,
    routeId: routeIds.product.create,
    insertMethod: InsertMethod.Append,
  }));

  const [tabs, setTabs] = useState(() =>
    validateTabs(getTabsFromStorage() || [listTab], router.routes.slice()),
  );

  const [startPinnedTabs, setStartPinnedTabs] = useState<string[]>([
    productsListRoute,
  ]);
  const [endPinnedTabs, setEndPinnedTabs] = useState<string[]>([]);

  const [config] = useState(() => [
    listTabDefinition,
    detailTabDefinition,
    createTabDefinition,
  ]);

  const { activeTabId, setActiveTabId } = useTabbedNavigation2({
    config,
    onCloseAllTabs: useCallback(() => {
      navigate(homeRoute);
    }, [navigate]),
    startPinnedTabs,
    tabs,
    endPinnedTabs,
    onTabsChange: setTabs,
    resolveTabMeta: useCallback(() => ({}), []),
  });

  useEffect(() => {
    return persistTabs(tabs);
  }, [tabs, persistTabs]);

  return (
    <div css={layoutStyles}>
      <Tabs
        tabs={tabs}
        onTabsChange={setTabs}
        onStartPinnedTabsChange={setStartPinnedTabs}
        startPinnedTabs={startPinnedTabs}
        endPinnedTabs={endPinnedTabs}
        onEndPinnedTabsChange={setEndPinnedTabs}
        initialActiveTabId={activeTabId}
        initialTabs={tabs}
        initialStartPinnedTabs={startPinnedTabs}
        hasControlledActiveTabId
        activeTabId={activeTabId}
        onActiveTabIdChange={setActiveTabId}
      />
      <div css={tabContentStyles}>
        <Outlet />
      </div>
    </div>
  );
}

export function ProductListRoute() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <Button
          onClick={() => {
            navigate(productsCreateRoute);
          }}
        >
          create new product
        </Button>
      </div>
      <div
        style={{
          marginTop: 10,
        }}
      >
        <Table
          onRowClick={(row) => {
            navigate(productDetailRoute.replace(":id", String(row.id)));
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
              width: 150,
            },
          ]}
          rows={products}
        />
      </div>
    </div>
  );
}

const layoutStyles = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const tabContentStyles = css`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
`;

export function ProductDetailRoute() {
  const params = useParams() as DetailParams;

  const [generalTab] = useState(() => ({
    id: productDetailRoute.replace(":id", params.id),
    title: "General",
    meta: {
      routeId: routeIds.product.detail,
      path: productDetailRoute.replace(":id", params.id),
    },
  }));
  const [settingsTab] = useState(() => ({
    id: productDetailSettingTabsRoute.replace(":id", params.id),
    title: "Settings",
    meta: {
      routeId: routeIds.product.tabs.settings,
      path: productDetailSettingTabsRoute.replace(":id", params.id),
    },
  }));

  const [tabs, setTabs] = useState(() => [generalTab, settingsTab]);

  const [config] = useState(() => [
    {
      title: () => generalTab.title,
      id: generalTab.id,
      routeId: generalTab.meta.routeId,
      insertMethod: InsertMethod.Prepend,
    },
    {
      title: () => settingsTab.title,
      id: settingsTab.id,
      routeId: settingsTab.meta.routeId,
      insertMethod: InsertMethod.Prepend,
    },
  ]);

  const { activeTabId, setActiveTabId } = useTabbedNavigation2({
    config,
    onCloseAllTabs: useCallback(() => {}, []),
    tabs,
    startPinnedTabs: useMemo(() => [], []),
    endPinnedTabs: useMemo(() => [], []),
    onTabsChange: useCallback(() => {}, []),
    resolveTabMeta: useCallback(() => ({}), []),
  });

  return (
    <div css={detailFormLayout}>
      <Tabs
        tabs={tabs}
        onTabsChange={setTabs}
        initialActiveTabId={activeTabId}
        initialTabs={tabs}
        hasControlledActiveTabId
        activeTabId={activeTabId}
        onActiveTabIdChange={setActiveTabId}
      />
      <div css={tabContentStyles}>
        <Outlet />
      </div>
    </div>
  );
}

const detailFormLayout = css({
  flexGrow: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

export function ProductGeneralTab() {
  return <div>General</div>;
}

export function ProductSettingsTab() {
  return <div>Settings</div>;
}

export function ProductCreateRoute() {
  return <div>Create product</div>;
}
