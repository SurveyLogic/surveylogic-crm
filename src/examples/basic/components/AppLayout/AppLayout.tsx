import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar.tsx";
import { Tabs } from "../../components/Tabs/Tabs.tsx";

import { TabStoreKey } from "../../constants/tabs.constants.ts";
import {
  TabbedNavigationMeta,
  TabsApi,
  convertRouteTreeToConfig,
  validateTabs,
  usePersistTabs,
} from "src/lib/tabs";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { localStorageDriver } from "src/lib/storage/local-storage.ts";

import { useDataRouterContext } from "src/hooks/useDataRouterContext.tsx";
import { homeRoute } from "../../constants/routes.constants.ts";
import { css } from "@emotion/react";
import { useDynamicRouterTabs } from "src/lib/tabs/useDynamicRouterTabs.tsx";

const persistStoreKey = {
  name: "basic__main-tabs",
  version: "1.0",
};

export function AppLayout() {
  const apiRef = useRef<TabsApi>();
  const navigate = useNavigate();
  const { router } = useDataRouterContext();

  const { getTabsFromStorage, persistTabs } =
    usePersistTabs<TabbedNavigationMeta>({
      storage: localStorageDriver,
      storageKey: persistStoreKey,
    });

  const [tabs, setTabs] = useState(() =>
    validateTabs(getTabsFromStorage() || [], router.routes.slice()),
  );

  const [startPinnedTabs, setStartPinnedTabsChange] = useState<string[]>([]);

  const { activeTabId, setActiveTabId } = useDynamicRouterTabs({
    tabs,
    onTabsChange: setTabs,
    startPinnedTabs,
    endPinnedTabs: useMemo(() => [], []),
    config: useMemo(
      () => convertRouteTreeToConfig(router.routes.slice(), TabStoreKey.Main),
      [router],
    ),
    onCloseAllTabs: () => {
      navigate(homeRoute);
    },
    resolveTabMeta: useCallback(() => ({}), []),
  });

  useEffect(() => {
    return persistTabs(tabs);
  }, [tabs, persistTabs]);

  return (
    <div css={layoutStyles}>
      <Sidebar />
      <div css={contentStyles}>
        <header css={headerStyles}>John Doe</header>
        <Tabs
          apiRef={apiRef}
          tabs={tabs}
          onTabsChange={setTabs}
          onStartPinnedTabsChange={setStartPinnedTabsChange}
          startPinnedTabs={startPinnedTabs}
          hasControlledActiveTabId
          activeTabId={activeTabId}
          onActiveTabIdChange={setActiveTabId}
        />
      </div>
    </div>
  );
}

const layoutStyles = css`
  display: grid;
  grid-template-columns: minmax(150px, 25%) 1fr;
  min-height: 100vh;
`;

const contentStyles = css`
  display: flex;
  flex-direction: column;
`;

const headerStyles = css`
  height: 40px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: end;
`;
