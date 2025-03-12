import "./AppLayout.css";

import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "src/components/Sidebar/Sidebar";
import { Tabs, TabsApi } from "src/components/Tabs/Tabs.tsx";

import { TabStoreKey } from "src/constants/tabs.constants.ts";
import {
  pathToLocation,
  TabModel,
  useTabbedNavigation,
} from "src/tabbed-navigation.tsx";
import * as routes from "src/constants/routes.constants.ts";
import { useRef } from "react";

export function AppLayout() {
  const navigate = useNavigate();

  const changeTab = (tab: TabModel | undefined) => {
    navigate(tab ? pathToLocation(tab.path) : routes.homeRoute);
  };

  const apiRef = useRef<TabsApi>();

  const { activeTabId, tabs, setTabs } = useTabbedNavigation(TabStoreKey.Main);

  return (
    <div className="layout">
      <Sidebar />
      <div className={"content"}>
        <header className={"header"}>John Doe</header>
        <Tabs
          hasControlledActiveTabId
          tabs={tabs}
          apiRef={apiRef}
          activeTabId={activeTabId}
          onTabsChange={setTabs}
          onActiveTabChange={changeTab}
          storeKey={TabStoreKey.Main}
        />
        <Outlet />
      </div>
    </div>
  );
}
