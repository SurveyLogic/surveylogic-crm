import { useDataRouterContext } from "./hooks/useDataRouterContext.tsx";
import {
  DataRouteMatch,
  matchRoutes,
  UIMatch,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { Handle, TabHandle } from "./router.tsx";
import { TabStoreKey } from "src/constants/tabs.constants.ts";
import { useCallback, useEffect, useState } from "react";
import { RouterState } from "@remix-run/router";
import { last, replaceAt } from "src/utils/array-utils.ts";

export type TabModel = {
  id: string;
  title: string;
  path: string;
  routeId: string;
  storeKey: string;
};

export const getTabHandle =
  (storeKey: string) =>
  (match: DataRouteMatch): TabHandle | undefined => {
    return (match.route?.handle as Handle | undefined)?.tabs.find(
      (tabHandle: TabHandle) => tabHandle.storeKey === storeKey,
    );
  };

export const getTabHandleUI =
  (storeKey: string) =>
  (match: UIMatch<any, Handle>): TabHandle | undefined => {
    return match?.handle?.tabs.find(
      (tabHandle: TabHandle) => tabHandle.storeKey === storeKey,
    );
  };

export function closestItem<T>(arr: T[], item: T): T | undefined {
  const index = arr.indexOf(item);
  if (index === -1) {
    return arr[0];
  } else if (index === arr.length - 1) {
    return arr[arr.length - 2];
  } else {
    return arr[index + 1];
  }
}

export const pathToLocation = (path: string) => {
  const [pathname, search] = path.split("?");
  return {
    pathname,
    search,
  };
};

export const useTabMatches = (tab: TabModel) => {
  const dataRouterContext = useDataRouterContext();
  const matches = matchRoutes(
    dataRouterContext.router.routes,
    pathToLocation(tab.path),
  );
  return matches || [];
};

export const useTabTitle = (tab: TabModel) => {
  const matches = useTabMatches(tab);

  const match = matches.slice().reverse().find(getTabHandle(tab.storeKey));

  if (match) {
    const handle = getTabHandle(tab.storeKey)(match!);
    return handle?.title?.(match);
  }
};

export const useActiveTabId = (key: TabStoreKey) => {
  const matches = useMatches() as UIMatch<any, Handle>[];
  const storeMatches = matches.filter(getTabHandleUI(key));

  return storeMatches[storeMatches.length - 1]?.pathname;
};

export const useTabbedNavigation = (
  storeKey: TabStoreKey,
  fallbackPath: string,
) => {
  const [tabs, setTabs] = useState<TabModel[]>([]);
  const { router } = useDataRouterContext();
  const navigate = useNavigate();

  const onActiveTabIdChange = (id: string | undefined) => {
    const tab = tabs.find(tab => tab.id === id);
    navigate(tab ? pathToLocation(tab.path) : fallbackPath);
  };
  const updateTabs = useCallback(
    (state: RouterState) => {
      const { matches, location, navigation } = state;

      if (navigation.location) {
        return;
      }

      const match = matches.slice().reverse().find(getTabHandle(storeKey));

      if (!match) {
        return;
      }

      const updateTabsState = (prevTabs: TabModel[]) => {
        const doesTabBelongToRouteMatch = (tab: TabModel) => {
          return (
            tab.routeId === match.route.id &&
            pathToLocation(tab.path).pathname.startsWith(match.pathname)
          );
        };

        const tab = prevTabs.find(doesTabBelongToRouteMatch);

        const { pathname } = last(matches);
        const { search } = location;
        const path = pathname + (search ? `${search}` : "");

        if (tab) {
          // update the tab path
          const index = prevTabs.indexOf(tab);

          return replaceAt(prevTabs, index, {
            ...tab,
            path,
          });
        }

        const handle: Handle = match.route?.handle;
        const title = handle.tabs[0]?.title?.(match);

        const newTab = {
          storeKey: storeKey,
          id: match.pathname,
          title,
          path,
          routeId: match.route.id,
        };

        // prepend a new tab
        return [newTab, ...prevTabs];
      };

      setTabs(updateTabsState);
    },
    [storeKey],
  );

  useEffect(() => {
    // fire immediately
    updateTabs(router.state);
    return router.subscribe(updateTabs);
  }, [router, storeKey, updateTabs]);

  const activeTabId = useActiveTabId(storeKey);

  return {
    activeTabId,
    tabs,
    onTabsChange: setTabs,
    onActiveTabIdChange,
    hasControlledActiveTabId: true
  };
};
