import { createBrowserRouter, Params } from "react-router-dom";
import {AppLayout} from "src/components/AppLayout/AppLayout.tsx";
import {ProductsRoute} from "src/routes/ProductsRoute.tsx";
import {CategoriesRoute} from "src/routes/CategoriesRoute.tsx";
import {SuppliersRoute} from "src/routes/SuppliersRoute.tsx";
import {HomeRoute} from "src/routes/HomeRoute.tsx";
import {TabStoreKey} from "src/constants/tabs.constants.ts";
import * as routes from "src/constants/routes.constants.ts";

export type TabHandle = {
	storeKey: string;
	title: (props: { params: Params }) => string;
	type?: string;
};

export type Handle = {
	tabs: TabHandle[];
};

export const router = createBrowserRouter([
	{
		path: routes.homeRoute,
		element: <AppLayout/>,
		children: [
			{
				index: true,
				element: <HomeRoute/>
			},
			{
				path: routes.productsRoute,
				element: <ProductsRoute/>,
				handle: ({
					tabs: [
						{
							storeKey: TabStoreKey.Main,
							title: () => 'products',
						}
					]
				}) as Handle
			},
			{
				path: routes.categoriesRoute,
				element: <CategoriesRoute/>,
				handle: ({
					tabs: [
						{
							storeKey: TabStoreKey.Main,
							title: () => 'categories',
						}
					]
				}) as Handle
			},
			{
				path: routes.suppliersRoute,
				element: <SuppliersRoute/>,
				handle: ({
					tabs: [
						{
							storeKey: TabStoreKey.Main,
							title: () => 'suppliers',
						}
					]
				}) as Handle
			},
		]
	}
]);
