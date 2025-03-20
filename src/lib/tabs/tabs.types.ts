import { Params } from "react-router-dom";
import { ReactNode } from "react";

export type ValidTabMeta = Record<string, unknown>;

export type TabModel<Meta extends ValidTabMeta = ValidTabMeta> = {
  id: string;
  title: string;
  content: ReactNode;
  isClosable?: boolean;
  meta: Meta;
};

export type TabHandle = {
  key: string;
  title: (props: { params: Params }) => string;
};

export type Handle = {
  tabs: TabHandle[];
};
