import "./Tabs.css";
import { useEffect, useState } from "react";
import { RouterState } from "@remix-run/router";

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

let tabId = 0;

export function Tabs(props: {
  storeKey: string;
  onActiveTabChange?: (tab: TabModel | undefined) => void;
}) {
  const { storeKey, onActiveTabChange = noop } = props;
  const [tabs, setTabs] = useState<TabModel[]>([]);
  const { router } = useDataRouterContext();
  const activeTab = useActiveTab(tabs);

  useEffect(() => {
    const handleLocationChange = (state: RouterState) => {
      const { matches, location, navigation } = state;

      const match = matches.find((match) => getTabHandle(match, storeKey));

      if (navigation.location) {
        return;
      }

      if (match) {
        setTabs((prevTabs) => {
          const tab = prevTabs.find(
            (tab) =>
              tab.routeId === match.route.id &&
              getTabLocation(tab).pathname.startsWith(match.pathname),
          );

          const path =
            last(matches).pathname +
            (location.search ? `${location.search}` : "");

          if (!tab) {
            return [
              {
                storeKey: storeKey,
                id: `${tabId++}`,
                path: path,
                routeId: match.route.id,
              },
              ...prevTabs,
            ];
          } else {
            const index = prevTabs.indexOf(tab);
            return replaceAt(prevTabs, index, {
              ...tab,
              path: path,
            });
          }
          return prevTabs;
        });
      }
    };
    // fire immediately
    handleLocationChange(router.state);
    return router.subscribe(handleLocationChange);
  }, [router, storeKey]);

  const closeTab = (tab: TabModel) => {
    const closest = closestItem(tabs, tab);
    if (!closest) {
      onActiveTabChange(undefined);
    } else {
      onActiveTabChange(closest);
    }

    setTabs((prevTabs) => removeItem(prevTabs, tab));
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
