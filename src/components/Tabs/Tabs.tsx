import "./Tabs.css";
import { useCallback, useEffect, useState } from "react";
import { RouterState } from "@remix-run/router";
import { uid } from "uid";

import { noop } from "src/utils/noop.ts";
import { useDataRouterContext } from "src/hooks/useDataRouterContext.tsx";
import { last, removeItem, replaceAt } from "src/utils/array-utils.ts";
import {
  closestItem,
  getTabHandle,
  getTabLocation,
  TabModel,
  useActiveTab,
} from "src/tabbed-navigation.tsx";
import { Tab } from "src/components/Tabs/Tab.tsx";

type TabsProps = {
  storeKey: string;
  onActiveTabChange?: (tab: TabModel | undefined) => void;
};

export function Tabs(props: TabsProps) {
  const { storeKey, onActiveTabChange = noop } = props;

  const [tabs, setTabs] = useState<TabModel[]>([]);
  const { router } = useDataRouterContext();
  const activeTab = useActiveTab(tabs);

  const updateTabs = useCallback(
    (state: RouterState) => {
      const { matches, location, navigation } = state;

      if (navigation.location) {
        return;
      }

      const match = matches.find((match) => getTabHandle(match, storeKey));

      if (!match) {
        return;
      }

      const updateTabsState = (prevTabs: TabModel[]) => {
        const doesTabBelongToMatch = (tab: TabModel) => {
          return (
            tab.routeId === match.route.id &&
            getTabLocation(tab).pathname.startsWith(match.pathname)
          );
        };

        const tab = prevTabs.find(doesTabBelongToMatch);

        const path =
          last(matches).pathname +
          (location.search ? `${location.search}` : "");

        if (tab) {
          // update the tab path
          const index = prevTabs.indexOf(tab);
          return replaceAt(prevTabs, index, {
            ...tab,
            path: path,
          });
        }

        // prepend a new tab
        return [
          {
            storeKey: storeKey,
            id: uid(),
            path: path,
            routeId: match.route.id,
          },
          ...prevTabs,
        ];
      };

      setTabs(updateTabsState);
    },
    [storeKey],
  );

  useEffect(() => {
    // fire immediately
    updateTabs(router.state);
    return router.subscribe(updateTabs);
  }, [router, storeKey, updateTabs]);

  const closeTab = (tab: TabModel) => {
    onActiveTabChange(closestItem(tabs, tab));
    const removeTab = (tabs: TabModel[]) => removeItem(tabs, tab);
    setTabs(removeTab);
  };

  if (tabs.length < 1) {
    return null;
  }

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <Tab
          onActiveTabChange={onActiveTabChange}
          onClose={closeTab}
          isActive={activeTab?.id === tab.id}
          tab={tab}
          key={tab.id}
        />
      ))}
    </div>
  );
}
