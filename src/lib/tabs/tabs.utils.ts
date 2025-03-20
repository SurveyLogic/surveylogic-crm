import { RouteObject } from "react-router-dom";
import { Handle } from "src/lib/tabs/tabs.types.ts";
import { InsertMethod, TabConfig } from "src/lib/tabs/useDynamicRouterTabs";

type FlatRouteObject = RouteObject & { parentRoute: RouteObject | undefined };

export const flattenRoutes = (
  routes: RouteObject[],
  parentRoute: RouteObject | undefined = undefined,
): FlatRouteObject[] => {
  return routes.reduce((acc, route) => {
    return [
      ...acc,
      {
        ...route,
        parentRoute,
      },
      ...flattenRoutes(route.children || [], route),
    ];
  }, [] as FlatRouteObject[]);
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

export const convertRouteTreeToConfig = (tree: RouteObject[], key: string) => {
  const flatRoutes = flattenRoutes(tree);

  const matchedRoutes = flatRoutes.filter((route) => {
    return (route.handle as Handle)?.tabs.find((tab) => tab.key === key);
  });

  const config: TabConfig<any>[] = matchedRoutes.map((route) => {
    const handle = route.handle as Handle;
    const tabMeta = handle.tabs.find((tab) => (tab.key = key));

    const id: TabConfig<any>["id"] = !route.index
      ? ({ params }) => replacePathParams(route.path!, params)
      : ({ params }) =>
          replacePathParams(route.parentRoute!.path!, params) + "/";

    return {
      id,
      title: tabMeta!.title,
      routeId: route.id!,
      insertMethod: InsertMethod.Prepend,
    };
  });
  return config;
};

export const replacePathParams = (
  path: string,
  params: Record<string, unknown>,
) => {
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(":" + key, params[key] + ""),
    path,
  );
};
