import "./AppLayout.css";

import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "src/components/Sidebar/Sidebar";
import {Tabs, TabsApi} from "src/components/Tabs/Tabs.tsx";

import { TabStoreKey } from "src/constants/tabs.constants.ts";
import {getTabHandle, getTabLocation, TabModel} from "src/tabbed-navigation.tsx";
import * as routes from "src/constants/routes.constants.ts";
import {useCallback, useEffect, useRef} from "react";
import {RouterState} from "@remix-run/router";
import {last, replaceAt} from "src/utils/array-utils.ts";
import {uid} from "uid";
import {useDataRouterContext} from "src/hooks/useDataRouterContext.tsx";
import {Handle} from "src/router.tsx";

export function AppLayout() {
  const navigate = useNavigate();

  const changeTab = (tab: TabModel | undefined) => {
    navigate(tab ? getTabLocation(tab) : routes.homeRoute);
  };

  const { router } = useDataRouterContext();
  const storeKey = TabStoreKey.Main;
  const apiRef = useRef<TabsApi>()

  const updateTabs = useCallback(
    (state: RouterState) => {
      const { matches, location, navigation } = state;

      if (navigation.location) {
        return;
      }

      const match = matches.find((match) => getTabHandle(match, storeKey));

      if (!match) {
        return;
      }

      const updateTabsState = (prevTabs: TabModel[]) => {
        const doesTabBelongToRouteMatch = (tab: TabModel) => {
          return (
            tab.routeId === match.route.id &&
            getTabLocation(tab).pathname.startsWith(match.pathname)
          );
        };

        const tab = prevTabs.find(doesTabBelongToRouteMatch);

        const path =
          last(matches).pathname +
          (location.search ? `${location.search}` : "");

        if (tab) {
          // update the tab path
          const index = prevTabs.indexOf(tab);
          apiRef.current?.setActiveTabId(tab.id);
          return replaceAt(prevTabs, index, {
            ...tab,
            path: path,
          });

        }

        const handle: Handle = (match.route?.handle);
        const title = handle.tabs[0]?.title?.(match);

        const newTab = {
          storeKey: storeKey,
          id: uid(),
          title,
          path,
          routeId: match.route.id,
        }

        apiRef.current?.setActiveTabId(newTab.id);

        // prepend a new tab
        return [
          newTab,
          ...prevTabs,
        ];
      };

      apiRef.current?.setTabs(updateTabsState)
    },
    [storeKey],
  );

  useEffect(() => {
    // fire immediately
    updateTabs(router.state);
    return router.subscribe(updateTabs);
  }, [router, storeKey, updateTabs]);


  return (
    <div className="layout">
      <Sidebar />
      <div className={"content"}>
        <header className={"header"}>John Doe</header>
        <Tabs apiRef={apiRef} onActiveTabChange={changeTab} storeKey={TabStoreKey.Main} />
        <Outlet />
      </div>
    </div>
  );
}

