import "./AppLayout.css";

import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "src/examples/basic/components/Sidebar/Sidebar.tsx";
import { Tabs, TabsApi } from "src/examples/basic/components/Tabs/Tabs.tsx";

import { TabStoreKey } from "src/examples/basic/constants/tabs.constants.ts";
import { TabbedNavigationMeta, useTabbedNavigation } from "src/lib/tabs";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePersistTabs } from "src/lib/tabs/persist.ts";
import { localStorageDriver } from "src/lib/storage/local-storage.ts";
import { validateTabs } from "src/lib/tabs";
import { useDataRouterContext } from "src/hooks/useDataRouterContext.tsx";
import { basicExampleRoute } from "src/examples/basic/constants/routes.constants.ts";

const persistStoreKey = {
  name: "main-tabs",
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

  const { activeTabId, setActiveTabId } = useTabbedNavigation({
    tabs,
    onTabsChange: setTabs,
    startPinnedTabs,
    key: TabStoreKey.Main,
    onCloseAllTabs: () => {
      navigate(basicExampleRoute);
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
