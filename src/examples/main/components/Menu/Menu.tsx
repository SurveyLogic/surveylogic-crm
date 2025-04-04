import { Link } from "react-router-dom";
import {
  dashboardRoute,
  ordersRoute,
  suppliersRoute,
} from "src/examples/main/constants/routes.constants.ts";
import { css } from "@emotion/react";

export const Menu = () => {
  return (
    <nav css={rootStyles}>
      <Link css={linkStyles} to={dashboardRoute}>
        Dashboard
      </Link>
      <Link css={linkStyles} to={ordersRoute}>
        Orders
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
