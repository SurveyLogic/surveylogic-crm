import { Link } from "react-router-dom";
import {
  categoriesRoute,
  dashboardRoute,
  productsRoute,
  suppliersRoute,
} from "src/examples/clip-one/constants/routes.constants.ts";
import { css } from "@emotion/react";

export const Menu = () => {
  return (
    <nav css={rootStyles}>
      <Link css={linkStyles} to={dashboardRoute}>
        Dashboard
      </Link>
      <Link css={linkStyles} to={productsRoute}>
        Products
      </Link>
      <Link css={linkStyles} to={categoriesRoute}>
        Categories
      </Link>
      <Link css={linkStyles} to={suppliersRoute}>
        Suppliers
      </Link>
    </nav>
  );
};

const linkStyles = css`
  padding: 10px 15px;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  color: var(--foreground-color-inverse);
  text-decoration: none;
`;

const rootStyles = css`
  display: flex;
  flex-direction: column;
`;
