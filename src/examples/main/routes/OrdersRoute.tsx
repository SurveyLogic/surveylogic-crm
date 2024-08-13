import { Tabs } from "../components/Tabs/Tabs.tsx";
import { TabbedNavigationMeta, TabModel } from "src/lib/tabs";

import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { routeIds } from "../routes.tsx";
import { data as orders } from "../data/orders.json";

import { usePersistTabs } from "src/lib/tabs/persist.tsx";
import { localStorageDriver } from "src/lib/storage/local-storage.ts";
import { validateTabs } from "src/lib/tabs";
import { useDataRouterContext } from "src/hooks/useDataRouterContext.tsx";
import {
  homeRoute,
  orderDetailRoute,
  orderDetailSettingTabsRoute,
  ordersCreateRoute,
  ordersListRoute,
} from "../constants/routes.constants.ts";
import {
  InsertMethod,
  useDynamicRouterTabs,
} from "src/lib/tabs/useDynamicRouterTabs.tsx";
import { css } from "@emotion/react";
import { Table } from "src/examples/main/components/Table/Table.tsx";
import { Button } from "src/examples/main/components/Button/Button.tsx";

type DetailParams = { id: string };

const persistStoreKey = {
  name: "main__order-tabs",
  version: "1.0",
};

export function OrdersRoute() {
  const navigate = useNavigate();
  const { router } = useDataRouterContext();
  const { getTabsFromStorage, persistTabs } =
    usePersistTabs<TabbedNavigationMeta>({
      storageKey: persistStoreKey,
      storage: localStorageDriver,
    });

  const [listTab] = useState(() => ({
    id: ordersListRoute,
    title: "All orders",
    meta: {
      routeId: routeIds.product.list,
      path: ordersListRoute,
    },
  }));

  const [detailTabDefinition] = useState(() => ({
    title: ({ params }: { params: DetailParams }) => {
      const product = orders.find(
        (product) => String(product.id) === params.id,
      );
      return product!.title;
    },
    id: ({ params }: { params: DetailParams }) =>
      orderDetailRoute.replace(":id", params.id),
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
    title: () => "New order",
    id: ordersCreateRoute,
    routeId: routeIds.product.create,
    insertMethod: InsertMethod.Append,
  }));

  const [tabs, setTabs] = useState(() =>
    validateTabs(getTabsFromStorage() || [listTab], router.routes.slice()),
  );

  const [startPinnedTabs, setStartPinnedTabs] = useState<string[]>([
    ordersListRoute,
  ]);
  const [endPinnedTabs, setEndPinnedTabs] = useState<string[]>([]);

  const [config] = useState(() => [
    listTabDefinition,
    detailTabDefinition,
    createTabDefinition,
  ]);

  const { activeTabId, setActiveTabId } = useDynamicRouterTabs({
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
            navigate(ordersCreateRoute);
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
            navigate(orderDetailRoute.replace(":id", String(row.id)));
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
          rows={orders}
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

export function ProductDetailRoute() {
  const params = useParams() as DetailParams;

  const generalTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailRoute.replace(":id", params.id),
      title: "General",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.product.detail,
        path: orderDetailRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const settingsTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailSettingTabsRoute.replace(":id", params.id),
      title: "Settings",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.product.tabs.settings,
        path: orderDetailSettingTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );

  const [tabs, setTabs] = useState([generalTab, settingsTab]);

  useEffect(() => {
    setTabs([generalTab, settingsTab]);
  }, [generalTab, settingsTab]);

  const config = useMemo(
    () => [
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
    ],
    [settingsTab, generalTab],
  );

  const { activeTabId, setActiveTabId } = useDynamicRouterTabs({
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

export function OrderSettingsTab() {
  return <div>Settings</div>;
}

export function ProductCreateRoute() {
  return <div>Create product</div>;
}
