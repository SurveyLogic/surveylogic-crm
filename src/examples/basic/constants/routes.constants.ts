import { basePath } from "src/constants/routes.constants.ts";

export const basicExampleRoute = `${basePath}/basic`;

export const productsRoute = `${basicExampleRoute}/products`;
export const productsListRoute = `${basicExampleRoute}/products/`;
export const productDetailRoute = `${basicExampleRoute}/products/:id`;
export const categoriesRoute = `${basicExampleRoute}/categories`;
export const categoriesListRoute = `${basicExampleRoute}/categories/`;
export const categoryDetailRoute = `${basicExampleRoute}/categories/:id`;
export const suppliersRoute = `${basicExampleRoute}/suppliers`;
