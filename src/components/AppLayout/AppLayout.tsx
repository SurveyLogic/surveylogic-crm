import "./AppLayout.css";

import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "src/components/Sidebar/Sidebar";
import { Tabs, TabsApi } from "src/components/Tabs/Tabs.tsx";

import { TabStoreKey } from "src/constants/tabs.constants.ts";
import { useTabbedNavigation } from "src/lib/tabs";

import { useCallback, useRef } from "react";
import * as routes from "src/constants/routes.constants.ts";

export function AppLayout() {
  const apiRef = useRef<TabsApi>();
  const navigate = useNavigate();

  const { getTabsProps } = useTabbedNavigation({
    key: TabStoreKey.Main,
    onCloseAllTabs: () => {
      navigate(routes.homeRoute);
    },
    resolveTabMeta: useCallback(() => ({}), []),
  });

  return (
    <div className="layout">
      <Sidebar />
      <div className={"content"}>
        <header className={"header"}>John Doe</header>
        <Tabs apiRef={apiRef} {...getTabsProps()} />
        <Outlet />
      </div>
    </div>
  );
}
