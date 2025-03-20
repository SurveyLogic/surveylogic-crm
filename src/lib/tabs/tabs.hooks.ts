import { useContext } from "react";
import {
  TabContext,
  TabContextValue,
  TabsApiRefContext,
} from "./tabs.components.tsx";
import { ValidTabMeta } from "src/lib/tabs/tabs.types.ts";

export const useTabContext = <Meta extends ValidTabMeta = ValidTabMeta>() => {
  return useContext<TabContextValue<Meta>>(TabContext);
};

export const useTabsApiRefContext = () => {
  return useContext(TabsApiRefContext);
};
