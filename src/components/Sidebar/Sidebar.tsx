import "./Sidebar.css";

import { Link } from "react-router-dom";
import * as routes from "src/constants/routes.constants.ts";
import { memo } from "react";

export function RawSidebar() {
  return (
    <aside>
      <nav className={"sidebar-menu"}>
        <Link to={routes.productsRoute}>products</Link>
        <Link to={routes.categoriesRoute}>categories</Link>
        <Link to={routes.suppliersRoute}>suppliers</Link>
      </nav>
    </aside>
  );
}

export const Sidebar = memo(RawSidebar);
