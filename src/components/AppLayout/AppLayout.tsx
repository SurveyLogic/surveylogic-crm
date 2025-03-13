import "./AppLayout.css";

import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "src/components/Sidebar/Sidebar";
import { Tabs, TabsApi } from "src/components/Tabs/Tabs.tsx";

import { TabStoreKey } from "src/constants/tabs.constants.ts";
import { TabbedNavigationMeta, useTabbedNavigation } from "src/lib/tabs";

import { useCallback, useEffect, useRef, useState } from "react";
import * as routes from "src/constants/routes.constants.ts";

import { usePersistTabs } from "src/lib/tabs/persist.ts";
import { localStorageDriver } from "src/lib/storage/local-storage.ts";

const persistStoreKey = {
  name: "main-tabs",
  version: "1.0",
};

export function AppLayout() {
  const apiRef = useRef<TabsApi>();
  const navigate = useNavigate();

  const { getTabsFromStorage, persistTabs } =
    usePersistTabs<TabbedNavigationMeta>({
      storage: localStorageDriver,
      storageKey: persistStoreKey,
    });

  const [tabs, setTabs] = useState(getTabsFromStorage() || []);

  const [startPinnedTabs, setStartPinnedTabsChange] = useState<string[]>([]);

  const { activeTabId, setActiveTabId } = useTabbedNavigation({
    tabs,
    onTabsChange: setTabs,
    startPinnedTabs,
    key: TabStoreKey.Main,
    onCloseAllTabs: () => {
      navigate(routes.homeRoute);
    },
    resolveTabMeta: useCallback(() => ({}), []),
  });

  useEffect(() => {
    return persistTabs(tabs);
  }, [tabs, persistTabs]);

  return (
    <div className="layout">
      <Sidebar />
      <div className={"content"}>
        <header className={"header"}>John Doe</header>
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
        <Outlet />
      </div>
    </div>
  );
}
