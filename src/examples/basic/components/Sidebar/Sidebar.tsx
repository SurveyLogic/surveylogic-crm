import { Link } from "react-router-dom";
import * as routes from "src/constants/routes.constants.ts";
import { memo } from "react";
import {
  categoriesRoute,
  productsRoute,
  suppliersRoute,
} from "../../constants/routes.constants.ts";
import { css } from "@emotion/react";

export function RawSidebar() {
  return (
    <aside css={asideStyles}>
      <div css={backLink}>
        <Link to={routes.homeRoute}>back to examples</Link>
      </div>
      <nav css={menuStyles}>
        <Link to={productsRoute}>products</Link>
        <Link to={categoriesRoute}>categories</Link>
        <Link to={suppliersRoute}>suppliers</Link>
      </nav>
    </aside>
  );
}

const backLink = css({
  position: "absolute",
  bottom: 20,
});

const menuStyles = css`
  display: flex;
  flex-direction: column;
`;

const asideStyles = css`
  border-right: 1px solid #eee;
  padding: 16px 16px 50px;
`;

export const Sidebar = memo(RawSidebar);
