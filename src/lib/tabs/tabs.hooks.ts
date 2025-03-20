import { useContext } from "react";
import {
  TabContext,
  TabContextValue,
  TabsApiRefContext,
} from "./tabs.components.tsx";
import { Handle, ValidTabMeta } from "src/lib/tabs/tabs.types.ts";
import { UIMatch, useMatches } from "react-router-dom";
import { getTabHandleUI } from "src/lib/tabs/tabbed-navigation.tsx";

export const useTabContext = <Meta extends ValidTabMeta = ValidTabMeta>() => {
  return useContext<TabContextValue<Meta>>(TabContext);
};

export const useTabsApiRefContext = () => {
  return useContext(TabsApiRefContext);
};

export const useActiveTabId = (key: string) => {
  const matches = useMatches() as UIMatch<any, Handle>[];
  const storeMatches = matches.filter(getTabHandleUI(key));

  return storeMatches[storeMatches.length - 1]?.pathname;
};
