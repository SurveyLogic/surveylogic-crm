import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import {
  categoriesListRoute,
  categoryDetailRoute,
  homeRoute,
} from "src/constants/routes.constants.ts";
import { routeIds } from "src/router.tsx";
import { useCallback, useMemo, useState } from "react";
import { Tabs } from "src/components/Tabs/Tabs.tsx";
import {
  Tab,
  useTabbedNavigation2,
} from "src/lib/tabs/tabbed-navigation-2.tsx";

type DetailTabParams = { id: string };

export function CategoriesRoute() {
  const [listTab] = useState(
    () =>
      new Tab({
        title: () => "List",
        id: categoriesListRoute,
        routeId: routeIds.category.list,
      }),
  );

  const [detailTab] = useState(
    () =>
      new Tab<DetailTabParams>({
        title: ({ params }) => `Category ${params.id}`,
        id: ({ params }) => categoryDetailRoute.replace(":id", params.id),
        routeId: routeIds.category.detail,
      }),
  );

  const navigate = useNavigate();
  const { getTabsProps } = useTabbedNavigation2({
    config: useMemo(() => [listTab, detailTab], [listTab, detailTab]),
    onCloseAllTabs: () => {
      navigate(homeRoute);
    },
    initialStartPinnedTabs: [listTab.id],
    initialTabs: [
      {
        id: listTab.id,
        title: "List",
        meta: {
          routeId: listTab.id,
          path: "",
        },
      },
    ],
    resolveTabMeta: useCallback(() => ({}), []),
  });

  return (
    <div>
      <Tabs {...getTabsProps()} />
      <Outlet />
    </div>
  );
}

export function CategoryListRoute() {
  return (
    <div>
      <ul>
        <li>
          <Link to={categoryDetailRoute.replace(":id", "1")}>Category 1</Link>
        </li>
        <li>
          <Link to={categoryDetailRoute.replace(":id", "2")}>Category 2</Link>
        </li>
      </ul>
    </div>
  );
}

export function CategoryDetailRoute() {
  const params = useParams();
  return <div>detail ${params.id}</div>;
}
