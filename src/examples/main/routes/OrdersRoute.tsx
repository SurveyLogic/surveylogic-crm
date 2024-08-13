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

//custom routes
  orderDetailCompanyTabsRoute,
  orderDetailItemsTabsRoute,
  orderDetailTotalsTabsRoute,
  orderDetailPaymentsTabsRoute,
  orderDetailProductionTabsRoute,
  orderDetailPartsTabsRoute,
  orderDetailNotesTabsRoute,
  orderDetailActivitiesTabsRoute,
  orderDetailArtworkTabsRoute,
  orderDetailDocumentsTabsRoute,
  orderDetailShippingTabsRoute,
  orderDetailUserDefinedFieldsTabsRoute,
  orderDetailAdvancedTabsRoute,


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
      routeId: routeIds.order.list,
      path: ordersListRoute,
    },
  }));

  const [detailTabDefinition] = useState(() => ({
    title: ({ params }: { params: DetailParams }) => {
      const order = orders.find(
        (order) => String(order.id) === params.id,
      );
      return order!.companyName;
    },
    id: ({ params }: { params: DetailParams }) =>
      orderDetailRoute.replace(":id", params.id),
    routeId: routeIds.order.detail,
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
    routeId: routeIds.order.create,
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

export function OrderListRoute() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <Button
          onClick={() => {
            navigate(ordersCreateRoute);
          }}
        >
          create new order
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
              name: "Order Number",
              width: 90,
            },
            {
              field: "companyName",
              name: "CompanyName",
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

export function OrderDetailRoute() {
  const params = useParams() as DetailParams;

  const generalTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailRoute.replace(":id", params.id),
      title: "General",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.detail,
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
        routeId: routeIds.order.tabs.settings,
        path: orderDetailSettingTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );

  //add custom tabs
  const companyTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailCompanyTabsRoute.replace(":id", params.id),
      title: "Company",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.company,
        path: orderDetailCompanyTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const itemsTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailItemsTabsRoute.replace(":id", params.id),
      title: "Items",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.items,
        path: orderDetailItemsTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const totalsTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailTotalsTabsRoute.replace(":id", params.id),
      title: "Totals",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.totals,
        path: orderDetailTotalsTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const paymentsTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailPaymentsTabsRoute.replace(":id", params.id),
      title: "Payments",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.payments,
        path: orderDetailPaymentsTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const productionTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailProductionTabsRoute.replace(":id", params.id),
      title: "Production",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.production,
        path: orderDetailProductionTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const partsTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailPartsTabsRoute.replace(":id", params.id),
      title: "Parts",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.parts,
        path: orderDetailPartsTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const notesTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailNotesTabsRoute.replace(":id", params.id),
      title: "Notes",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.notes,
        path: orderDetailNotesTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const activitiesTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailActivitiesTabsRoute.replace(":id", params.id),
      title: "Activities",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.notes,
        path: orderDetailActivitiesTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const artworkTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailArtworkTabsRoute.replace(":id", params.id),
      title: "Artwork",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.artwork,
        path: orderDetailArtworkTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const documentsTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailDocumentsTabsRoute.replace(":id", params.id),
      title: "Documents",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.documents,
        path: orderDetailDocumentsTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const shippingTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailShippingTabsRoute.replace(":id", params.id),
      title: "Shipping",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.shipping,
        path: orderDetailShippingTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const userdefinedfieldsTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailUserDefinedFieldsTabsRoute.replace(":id", params.id),
      title: "User Defined Fields",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.userdefinedfields,
        path: orderDetailUserDefinedFieldsTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );
  const advancedTab = useMemo<TabModel<TabbedNavigationMeta>>(
    () => ({
      id: orderDetailAdvancedTabsRoute.replace(":id", params.id),
      title: "Advanced",
      content: <Outlet />,
      isClosable: false,
      meta: {
        routeId: routeIds.order.tabs.advanced,
        path: orderDetailAdvancedTabsRoute.replace(":id", params.id),
      },
    }),
    [params.id],
  );


  const [tabs, setTabs] = useState([
    generalTab, 
    settingsTab, 
    companyTab, 
    itemsTab, 
    totalsTab, 
    paymentsTab, 
    productionTab, 
    partsTab, 
    notesTab, 
    activitiesTab, 
    artworkTab, 
    documentsTab, 
    shippingTab, 
    userdefinedfieldsTab, 
    advancedTab]);

  useEffect(() => {
    setTabs([generalTab, settingsTab, companyTab, itemsTab, totalsTab, paymentsTab, productionTab, partsTab, notesTab, activitiesTab, artworkTab, documentsTab, shippingTab, userdefinedfieldsTab, advancedTab]);
  }, [generalTab, settingsTab, companyTab, itemsTab, totalsTab, paymentsTab, productionTab, partsTab, notesTab, activitiesTab, artworkTab, documentsTab, shippingTab, userdefinedfieldsTab, advancedTab]);

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
      //add custom tabs
      {
        title: () => companyTab.title,
        id: companyTab.id,
        routeId: companyTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => itemsTab.title,
        id: itemsTab.id,
        routeId: itemsTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => totalsTab.title,
        id: totalsTab.id,
        routeId: totalsTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => paymentsTab.title,
        id: paymentsTab.id,
        routeId: paymentsTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => productionTab.title,
        id: productionTab.id,
        routeId: productionTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => partsTab.title,
        id: partsTab.id,
        routeId: partsTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => notesTab.title,
        id: notesTab.id,
        routeId: notesTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => activitiesTab.title,
        id: activitiesTab.id,
        routeId: activitiesTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => artworkTab.title,
        id: artworkTab.id,
        routeId: artworkTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => documentsTab.title,
        id: documentsTab.id,
        routeId: documentsTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => shippingTab.title,
        id: shippingTab.id,
        routeId: shippingTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => userdefinedfieldsTab.title,
        id: userdefinedfieldsTab.id,
        routeId: userdefinedfieldsTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
      {
        title: () => advancedTab.title,
        id: advancedTab.id,
        routeId: advancedTab.meta.routeId,
        insertMethod: InsertMethod.Prepend,
      },
    ],
    [settingsTab, generalTab, companyTab, itemsTab, totalsTab, paymentsTab, productionTab, partsTab, notesTab, activitiesTab, artworkTab, documentsTab, shippingTab, userdefinedfieldsTab, advancedTab],
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

export function OrderGeneralTab() {
  return <div>General</div>;
}

export function OrderSettingsTab() {
  return <div>Settings</div>;
}

//add custom tabs
export function OrderCompanyTab() {
  return <div>Company</div>;
}
export function OrderItemsTab() {
  return <div>Items</div>;
}
export function OrderTotalsTab() {
  return <div>Totals</div>;
}
export function OrderPaymentsTab() {
  return <div>Payments</div>;
}
export function OrderProductionTab() {
  return <div>Production</div>;
}
export function OrderPartsTab() {
  return <div>Production</div>;
}
export function OrderNotesTab() {
  return <div>Notes</div>;
}
export function OrderActivitiesTab() {
  return <div>Activities</div>;
}
export function OrderArtworkTab() {
  return <div>Artwork</div>;
}
export function OrderDocumentsTab() {
  return <div>Documents</div>;
}
export function OrderShippingTab() {
  return <div>Shipping</div>;
}
export function OrderUserDefinedFieldsTab() {
  return <div>UserDefinedFields</div>;
}
export function OrderAdvancedTab() {
  return <div>Advanced</div>;
}




export function OrderCreateRoute() {
  return <div>Create order</div>;
}
