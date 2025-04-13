import { HTMLAttributes, PropsWithChildren } from "react";
import { css } from "@emotion/react";

export const Button = (
  props: PropsWithChildren<HTMLAttributes<HTMLButtonElement>>,
) => {
  const { children, ...rest } = props;
  return (
    <button css={rootStyles} {...rest}>
      {children}
    </button>
  );
};

const rootStyles = css`
  color: white;
  background-color: #5cb85c;
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  :hover {
    background-color: rgb(68, 157, 68);
  }
`;
