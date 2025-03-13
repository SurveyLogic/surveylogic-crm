import { TabModel } from "src/lib/tabs/tabs.types.ts";
import { matchRoutes, RouteObject } from "react-router-dom";
import { flattenRoutes } from "src/lib/tabs/tabs.utils.ts";
import { TabbedNavigationMeta } from "src/lib/tabs/tabbed-navigation.tsx";

export const validateTabs = <
  TabMeta extends TabbedNavigationMeta = TabbedNavigationMeta,
>(
  tabs: TabModel<TabMeta>[],
  routes: RouteObject[],
) => {
  const flattenedRoutes = flattenRoutes(routes);
  const routeIds = flattenedRoutes.map((route) => route.id);
  return (
    tabs
      // filter out tabs for routes that don't exist anymore
      .filter((tab) => routeIds.includes(tab.meta.routeId))
      // filter out tabs that have wrong paths
      .filter((tab) => {
        // Tab could have a wrong path because we changed its corresponding route paths in the config
        // For examples we changed /warehouse/product to /warehouse-management/product
        const tabRoute = flattenedRoutes.find(
          (route) => route.id === tab.meta.routeId,
        );
        const url = new URL(tab.meta.path, window.location.origin);
        const matches = matchRoutes(routes, url) || [];
        const tabIsMatched = matches.find(
          (match) =>
            match.route.path !== "*" && match.pathname === url.pathname,
        );

        return tabRoute && tabIsMatched;
      })
  );
};
