import { basePath } from "src/constants/routes.constants.ts";

export const homeRoute = `${basePath}/main`;

export const ordersRoute = `${homeRoute}/orders`;
export const ordersListRoute = `${homeRoute}/orders/`;
export const ordersCreateRoute = `${homeRoute}/orders/create`;
export const orderDetailRoute = `${homeRoute}/orders/:id`;
export const orderDetailSettingTabsRoute = `${homeRoute}/orders/:id/settings`;


//custom tabs routes
export const orderDetailCompanyTabsRoute = `${homeRoute}/orders/:id/company`;
export const orderDetailItemsTabsRoute = `${homeRoute}/orders/:id/items`;
export const orderDetailTotalsTabsRoute = `${homeRoute}/orders/:id/totals`;
export const orderDetailPaymentsTabsRoute = `${homeRoute}/orders/:id/payments`;
export const orderDetailProductionTabsRoute = `${homeRoute}/orders/:id/production`;
export const orderDetailPartsTabsRoute = `${homeRoute}/orders/:id/parts`;
export const orderDetailNotesTabsRoute = `${homeRoute}/orders/:id/notes`;
export const orderDetailActivitiesTabsRoute = `${homeRoute}/orders/:id/activities`;
export const orderDetailArtworkTabsRoute = `${homeRoute}/orders/:id/artwork`;
export const orderDetailDocumentsTabsRoute = `${homeRoute}/orders/:id/documents`;
export const orderDetailShippingTabsRoute = `${homeRoute}/orders/:id/shipping`;
export const orderDetailUserDefinedFieldsTabsRoute = `${homeRoute}/orders/:id/user-defined-fields`;
export const orderDetailAdvancedTabsRoute = `${homeRoute}/orders/:id/advanced`;

export const categoriesRoute = `${homeRoute}/categories`;
export const categoriesListRoute = `${homeRoute}/categories/`;
export const categoryDetailRoute = `${homeRoute}/categories/:id`;
export const categoryDetailSettingsTabRoute = `${homeRoute}/categories/:id/settings`;
export const suppliersRoute = `${homeRoute}/suppliers`;
export const dashboardRoute = `${homeRoute}/dashboard`;
