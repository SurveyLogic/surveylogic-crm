import { RouteObject } from "react-router-dom";

export const flattenRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.reduce((acc, route) => {
    return [...acc, route, ...flattenRoutes(route.children || [])];
  }, [] as RouteObject[]);
};
