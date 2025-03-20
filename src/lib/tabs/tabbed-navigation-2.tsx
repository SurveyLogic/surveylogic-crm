import { useDataRouterContext } from "../../hooks/useDataRouterContext.tsx";
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { RouterState, AgnosticDataRouteMatch } from "@remix-run/router";
import { last, replaceAt, insertAt } from "src/utils/array-utils.ts";
import { TabModel, ValidTabMeta } from "src/lib/tabs/tabs.types.ts";
import { pathToLocation } from "src/lib/tabs/tabs.utils.ts";

export type TabbedNavigationMeta = {
  path: string;
  routeId: string;
};

type ValidParams = Record<string, unknown>;

type ValidID<Params extends ValidParams = ValidParams> =
  | string
  | { (props: { params: Params }): string };

export type TabConfig<
  Params extends ValidParams = ValidParams,
  ID extends ValidID<Params> = ValidID<Params>,
> = {
  routeId: string;
  id: ID;
  insertMethod: InsertMethod;
  title: ({ params }: { params: Params }) => string;
};

export enum InsertMethod {
  Append = "append",
  Prepend = "prepend",
}

type TabsChangeCallback<Meta extends ValidTabMeta = ValidTabMeta> = (
  tabs:
    | TabModel<TabbedNavigationMeta & Meta>[]
    | {
        (
          prevTabs: TabModel<TabbedNavigationMeta & Meta>[],
        ): TabModel<TabbedNavigationMeta & Meta>[];
      },
) => void;

export const useTabbedNavigation2 = <
  Meta extends ValidTabMeta = ValidTabMeta,
  Params extends ValidParams = ValidParams,
>(options: {
  config: TabConfig<Params>[];
  onTabsChange?: TabsChangeCallback<Meta>;
  tabs: TabModel<TabbedNavigationMeta & Meta>[];
  startPinnedTabs: string[];
  endPinnedTabs: string[];
  onCloseAllTabs: () => void;
  resolveTabMeta: (match: AgnosticDataRouteMatch) => Meta;
}) => {
  const {
    resolveTabMeta,
    onCloseAllTabs,
    onTabsChange,
    tabs = [],
    startPinnedTabs,
    endPinnedTabs,
    config,
  } = options;

  // todo: validate tabs

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

      const pairs = matches
        .slice()
        .reverse()
        .map((match) => {
          const def = config.find(
            (tabDef) => tabDef.routeId === match.route.id,
          );
          return [def, match];
        })
        .filter(([def]) => !!def) as unknown as [
        TabConfig,
        AgnosticDataRouteMatch,
      ][];

      pairs.forEach(([def, match]) => {
        onTabsChange?.((prevTabs) => {
          const tab = prevTabs.find(
            (tab) =>
              tab.id ===
              (typeof def.id === "function" ? def.id(match) : def.id),
          );

          const { pathname } = last(matches);
          const { search } = location;
          const path = pathname + (search ? `${search}` : "");

          if (tab) {
            // update the tab path
            const index = prevTabs.indexOf(tab);

            return replaceAt(prevTabs, index, {
              ...tab,
              meta: {
                ...tab.meta,
                path,
                ...resolveTabMeta(match),
              },
            });
          } else {
            const prepend = def.insertMethod === InsertMethod.Prepend;

            const newTab: TabModel<TabbedNavigationMeta & Meta> = {
              id: typeof def.id === "function" ? def.id(match) : def.id,
              title: def.title(match),
              content: <Outlet />,
              meta: {
                path,
                routeId: match.route.id,
                ...resolveTabMeta(match),
              },
            };

            // prepend a new tab
            if (prepend) {
              return insertAt(prevTabs, startPinnedTabs.length, newTab);
            } else {
              return insertAt(
                prevTabs,
                prevTabs.length - endPinnedTabs.length,
                newTab,
              );
            }
          }
        });
      });
    },
    [resolveTabMeta, startPinnedTabs, config, onTabsChange, endPinnedTabs],
  );

  useEffect(() => {
    // fire immediately
    updateTabs(router.state);
    return router.subscribe(updateTabs);
  }, [router, updateTabs]);

  const matches = useMatches();

  const activeTabId = matches
    .slice()
    .reverse()
    .find((match) => {
      return config.find((def) => def.routeId === match.id);
    })?.pathname;

  return {
    setActiveTabId,
    activeTabId,
  };
};
