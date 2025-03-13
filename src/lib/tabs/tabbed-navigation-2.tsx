import { useDataRouterContext } from "../../hooks/useDataRouterContext.tsx";
import { useMatches, useNavigate } from "react-router-dom";
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
  title: ({ params }: { params: Params }) => string;
};

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
  onCloseAllTabs: () => void;
  resolveTabMeta: (match: AgnosticDataRouteMatch) => Meta;
}) => {
  const {
    resolveTabMeta,
    onCloseAllTabs,
    onTabsChange,
    tabs = [],
    startPinnedTabs,
    config,
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
            const newTab: TabModel<TabbedNavigationMeta & Meta> = {
              id: typeof def.id === "function" ? def.id(match) : def.id,
              title: def.title(match),
              meta: {
                path,
                routeId: match.route.id,
                ...resolveTabMeta(match),
              },
            };

            // prepend a new tab
            return insertAt(prevTabs, startPinnedTabs.length, newTab);
          }
        });
      });
    },
    [resolveTabMeta, startPinnedTabs, config, onTabsChange],
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
