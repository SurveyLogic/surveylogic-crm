import { RouteObject } from "react-router-dom";

export const flattenRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.reduce((acc, route) => {
    return [...acc, route, ...flattenRoutes(route.children || [])];
  }, [] as RouteObject[]);
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
