import { basePath } from "src/constants/routes.constants.ts";

export const homeRoute = `${basePath}/clip-one`;

export const productsRoute = `${homeRoute}/products`;
export const productsListRoute = `${homeRoute}/products/`;
export const productsCreateRoute = `${homeRoute}/products/create`;
export const productDetailRoute = `${homeRoute}/products/:id`;
export const productDetailSettingTabsRoute = `${homeRoute}/products/:id/settings`;
export const categoriesRoute = `${homeRoute}/categories`;
export const categoriesListRoute = `${homeRoute}/categories/`;
export const categoryDetailRoute = `${homeRoute}/categories/:id`;
export const categoryDetailSettingsTabRoute = `${homeRoute}/categories/:id/settings`;
export const suppliersRoute = `${homeRoute}/suppliers`;
export const dashboardRoute = `${homeRoute}/dashboard`;
