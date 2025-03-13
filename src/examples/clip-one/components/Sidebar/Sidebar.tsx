import { Link } from "react-router-dom";
import * as routes from "src/constants/routes.constants.ts";
import { memo } from "react";
import { css } from "@emotion/react";
import { Menu } from "src/examples/clip-one/components/Menu/Menu.tsx";

export function RawSidebar() {
  return (
    <aside css={rootStyles}>
      <div css={backLink}>
        <Link css={linkStyles} to={routes.homeRoute}>
          back to examples
        </Link>
      </div>
      <Menu />
    </aside>
  );
}

const backLink = [
  css({
    position: "absolute",
    bottom: 20,
    left: 15,
  }),
];

const linkStyles = css`
  font-size: 14px;
  color: var(--foreground-color-inverse);
  text-decoration: none;
`;

const rootStyles = css`
  background-color: var(--background-color-inverse);
  border-right: 1px solid var(--border-color);
`;

export const Sidebar = memo(RawSidebar);
