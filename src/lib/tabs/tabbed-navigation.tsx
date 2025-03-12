import { useDataRouterContext } from "../../hooks/useDataRouterContext.tsx";
import {
  DataRouteMatch,
  UIMatch,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { Handle, TabHandle } from "../../router.tsx";
import { useCallback, useEffect, useState } from "react";
import { RouterState, AgnosticDataRouteMatch } from "@remix-run/router";
import { last, replaceAt, insertAt } from "src/utils/array-utils.ts";
import { TabModel, ValidTabMeta } from "src/lib/tabs/tabs.types.ts";

export type TabbedNavigationMeta = {
  path: string;
  routeId: string;
};

export const getTabHandle =
  (key: string) =>
  (match: DataRouteMatch): TabHandle | undefined => {
    return (match.route?.handle as Handle | undefined)?.tabs.find(
      (tabHandle: TabHandle) => tabHandle.key === key,
    );
  };

export const getTabHandleUI =
  (key: string) =>
  (match: UIMatch<any, Handle>): TabHandle | undefined => {
    return match?.handle?.tabs.find(
      (tabHandle: TabHandle) => tabHandle.key === key,
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

export const useActiveTabId = (key: string) => {
  const matches = useMatches() as UIMatch<any, Handle>[];
  const storeMatches = matches.filter(getTabHandleUI(key));

  return storeMatches[storeMatches.length - 1]?.pathname;
};

export const useTabbedNavigation = <
  Meta1 extends ValidTabMeta = ValidTabMeta,
>(options: {
  initialTabs?: TabModel<TabbedNavigationMeta & Meta1>[];
  initialStartPinnedTabs?: string[];
  key: string;
  onCloseAllTabs: () => void;
  resolveTabMeta: (
    match: AgnosticDataRouteMatch,
    tabHandle: TabHandle,
  ) => Meta1;
}) => {
  type Meta = TabbedNavigationMeta & Meta1;

  const {
    key,
    resolveTabMeta,
    onCloseAllTabs,
    initialTabs = [],
    initialStartPinnedTabs = [],
  } = options;
  const [tabs, setTabs] = useState<TabModel<Meta>[]>(initialTabs);
  const [startPinnedTabs, setStartPinnedTabs] = useState<string[]>(
    initialStartPinnedTabs,
  );
  const { router } = useDataRouterContext();
  const navigate = useNavigate();

  const setActiveTabId = (id: string | undefined) => {
    const tab = tabs.find((tab) => tab.id === id);
    if (tab) {
      navigate(pathToLocation(tab.meta.path));
    } else {
      onCloseAllTabs?.();
    }
  };
  const updateTabs = useCallback(
    (state: RouterState) => {
      const { matches, location, navigation } = state;

      if (navigation.location) {
        return;
      }

      const match = matches.slice().reverse().find(getTabHandle(key));

      if (!match) {
        return;
      }

      const updateTabsState = (prevTabs: TabModel<Meta>[]) => {
        const doesTabBelongToRouteMatch = (tab: TabModel<Meta>) => {
          return (
            tab.meta.routeId === match.route.id &&
            pathToLocation(tab.meta.path).pathname.startsWith(match.pathname)
          );
        };

        const tab = prevTabs.find(doesTabBelongToRouteMatch);

        const { pathname } = last(matches);
        const { search } = location;
        const path = pathname + (search ? `${search}` : "");

        const handle: Handle = match.route?.handle;
        const tabHandle = handle.tabs.find((tab) => tab.key === key);
        const title = tabHandle!.title(match);

        if (tab) {
          // update the tab path
          const index = prevTabs.indexOf(tab);

          return replaceAt(prevTabs, index, {
            ...tab,
            meta: {
              ...tab.meta,
              path,
              ...resolveTabMeta(match, tabHandle!),
            },
          });
        } else {
          const newTab = {
            key: key,
            id: match.pathname,
            title,
            meta: {
              path,
              routeId: match.route.id,
              ...resolveTabMeta(match, tabHandle!),
            },
          };

          // prepend a new tab
          return insertAt(prevTabs, startPinnedTabs.length, newTab);
        }
      };

      setTabs(updateTabsState);
    },
    [key, resolveTabMeta, startPinnedTabs],
  );

  useEffect(() => {
    // fire immediately
    updateTabs(router.state);
    return router.subscribe(updateTabs);
  }, [router, key, updateTabs]);

  const activeTabId = useActiveTabId(key);

  return {
    getTabsProps: () => ({
      activeTabId,
      tabs,
      onTabsChange: setTabs,
      onActiveTabIdChange: setActiveTabId,
      hasControlledActiveTabId: true,
      startPinnedTabs,
      onStartPinnedTabsChange: setStartPinnedTabs,
    }),
    setTabs,
    setActiveTabId,
    tabs,
    activeTabId,
  };
};
