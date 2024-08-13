import { basePath } from "src/constants/routes.constants.ts";

export const homeRoute = `${basePath}/main`;

export const ordersRoute = `${homeRoute}/orders`;
export const ordersListRoute = `${homeRoute}/orders/`;
export const ordersCreateRoute = `${homeRoute}/orders/create`;
export const orderDetailRoute = `${homeRoute}/orders/:id`;
export const orderDetailSettingTabsRoute = `${homeRoute}/orders/:id/settings`;
export const categoriesRoute = `${homeRoute}/categories`;
export const categoriesListRoute = `${homeRoute}/categories/`;
export const categoryDetailRoute = `${homeRoute}/categories/:id`;
export const categoryDetailSettingsTabRoute = `${homeRoute}/categories/:id/settings`;
export const suppliersRoute = `${homeRoute}/suppliers`;
export const dashboardRoute = `${homeRoute}/dashboard`;
