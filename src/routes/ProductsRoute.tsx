
import {TabStoreKey} from "src/constants/tabs.constants.ts";
import {Tabs} from "src/components/Tabs/Tabs.tsx";
import {useTabbedNavigation} from "src/tabbed-navigation.tsx";
import {productDetailRoute, productsRoute} from "src/constants/routes.constants.ts";
import {Link, Outlet, useParams} from "react-router-dom";

export function ProductsRoute() {
  const {tabs, setTabs, activeTabId, changeTab} = useTabbedNavigation(TabStoreKey.Secondary, productsRoute)
  return <div>
    <Tabs
      hasControlledActiveTabId
      tabs={tabs}
      activeTabId={activeTabId}
      onTabsChange={setTabs}
      onActiveTabChange={changeTab}
    />
    <Outlet/>
  </div>
}

export function ProductListRoute() {
 return <div>
   <ul>
     <li>
       <Link to={productDetailRoute.replace(':id', '1')}>Product 1</Link>
     </li>
     <li>
       <Link to={productDetailRoute.replace(':id', '2')}>Product 2</Link>
     </li>
   </ul>


 </div>
}

export function ProductDetailRoute() {
  const params = useParams();
  return <div>detail ${params.id}</div>
}
