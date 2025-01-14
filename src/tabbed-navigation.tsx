import { useDataRouterContext } from "./hooks/useDataRouterContext.tsx";
import { DataRouteMatch, matchRoutes, useMatches } from "react-router-dom";
import { Handle, TabHandle } from "./router.tsx";

export type TabModel = {
  id: string;
  path: string;
  routeId: string;
  storeKey: string;
};

export const getTabHandle = (
  match: DataRouteMatch,
  storeKey: string,
): TabHandle | undefined => {
  return (match.route?.handle as Handle | undefined)?.tabs.find(
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

export const getTabLocation = (tab: TabModel) => {
  const [pathname, search] = tab.path.split("?");
  return {
    pathname,
    search,
  };
};

export const useTabMatches = (tab: TabModel) => {
  const dataRouterContext = useDataRouterContext();
  const matches = matchRoutes(
    dataRouterContext.router.routes,
    getTabLocation(tab),
  );
  return matches || [];
};

export const useTabTitle = (tab: TabModel) => {
  const matches = useTabMatches(tab);

  const match = matches
    .slice()
    .reverse()
    .find((match) => getTabHandle(match, tab.storeKey));
  if (match) {
    const handle = getTabHandle(match!, tab.storeKey);

    return handle?.title?.(match);
  }
};

export const useActiveTab = (tabs: TabModel[]) => {
  const matches = useMatches().slice().reverse();

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const tab = tabs.find(
      (tab) => getTabLocation(tab).pathname === match.pathname,
    );
    if (tab) {
      return tab;
    }
  }

  return undefined;
};
