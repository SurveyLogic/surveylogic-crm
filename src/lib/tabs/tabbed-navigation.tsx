import { useDataRouterContext } from "../../hooks/useDataRouterContext.tsx";
import {
  DataRouteMatch,
  UIMatch,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { Handle, TabHandle } from "src/lib/tabs";
import { useCallback, useEffect } from "react";
import { RouterState, AgnosticDataRouteMatch } from "@remix-run/router";
import { last, replaceAt, insertAt } from "src/utils/array-utils.ts";
import { TabModel, ValidTabMeta } from "src/lib/tabs/tabs.types.ts";
import { pathToLocation } from "src/lib/tabs/tabs.utils.ts";

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

export const useActiveTabId = (key: string) => {
  const matches = useMatches() as UIMatch<any, Handle>[];
  const storeMatches = matches.filter(getTabHandleUI(key));

  return storeMatches[storeMatches.length - 1]?.pathname;
};

type TabsChangeCallback<Meta extends ValidTabMeta = ValidTabMeta> = (
  tabs:
    | TabModel<TabbedNavigationMeta & Meta>[]
    | {
        (
          tabs: TabModel<TabbedNavigationMeta & Meta>[],
        ): TabModel<TabbedNavigationMeta & Meta>[];
      },
) => void;

export const useTabbedNavigation = <
  Meta extends ValidTabMeta = ValidTabMeta,
>(options: {
  tabs: TabModel<TabbedNavigationMeta & Meta>[];

  onTabsChange?: TabsChangeCallback<Meta>;
  startPinnedTabs: string[];
  key: string;
  onCloseAllTabs: () => void;
  resolveTabMeta: (match: AgnosticDataRouteMatch, tabHandle: TabHandle) => Meta;
}) => {
  type CompoundMeta = TabbedNavigationMeta & Meta;

  const {
    key,
    resolveTabMeta,
    onCloseAllTabs,
    tabs,
    startPinnedTabs,
    onTabsChange,
  } = options;

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

      const updateTabsState = (prevTabs: TabModel<CompoundMeta>[]) => {
        const doesTabBelongToRouteMatch = (tab: TabModel<CompoundMeta>) => {
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

      onTabsChange?.(updateTabsState);
    },
    [key, resolveTabMeta, startPinnedTabs, onTabsChange],
  );

  useEffect(() => {
    // fire immediately
    updateTabs(router.state);
    return router.subscribe(updateTabs);
  }, [router, key, updateTabs]);

  const activeTabId = useActiveTabId(key);

  return {
    setActiveTabId,
    activeTabId,
  };
};
