import "./Sidebar.css";

import { Link } from "react-router-dom";
import * as routes from "src/constants/routes.constants.ts";
import { memo } from "react";
import {
  categoriesRoute,
  productsRoute,
  suppliersRoute,
} from "src/examples/basic/constants/routes.constants.ts";

export function RawSidebar() {
  return (
    <aside
      style={{
        paddingBottom: 50,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 20,
        }}
      >
        <Link to={routes.homeRoute}>&lt;-- back to examples</Link>
      </div>
      <nav className={"sidebar-menu"}>
        <Link to={productsRoute}>products</Link>
        <Link to={categoriesRoute}>categories</Link>
        <Link to={suppliersRoute}>suppliers</Link>
      </nav>
    </aside>
  );
}

export const Sidebar = memo(RawSidebar);
