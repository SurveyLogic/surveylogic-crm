import "./AppLayout.css";

import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "src/components/Sidebar/Sidebar";
import { Tabs } from "src/components/Tabs/Tabs.tsx";

import { TabStoreKey } from "src/constants/tabs.constants.ts";
import { getTabLocation, TabModel } from "src/tabbed-navigation.tsx";
import * as routes from "src/constants/routes.constants.ts";

export function AppLayout() {
  const navigate = useNavigate();
  const changeTab = (tab: TabModel | undefined) => {
    navigate(tab ? getTabLocation(tab) : routes.homeRoute);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className={"content"}>
        <header className={"header"}>John Doe</header>
        <Tabs onActiveTabChange={changeTab} storeKey={TabStoreKey.Main} />
        <Outlet />
      </div>
    </div>
  );
}
