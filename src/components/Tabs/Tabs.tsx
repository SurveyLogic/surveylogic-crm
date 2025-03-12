import "./Tabs.css";
import React, { useEffect, useImperativeHandle, useReducer } from "react";
import { noop } from "src/utils/noop.ts";
import { removeItem } from "src/utils/array-utils.ts";
import { closestItem, TabModel } from "src/tabbed-navigation.tsx";
import { Tab } from "src/components/Tabs/Tab.tsx";

export type TabsApi = {
  setTabs: (tabs: TabModel[] | { (prevTabs: TabModel[]): TabModel[] }) => void;
  setActiveTabId: (id: string) => void;
  getTabs: () => TabModel[];
};

type TabsProps = {
  hasControlledActiveTabId?: boolean;
  activeTabId?: string;
  tabs?: TabModel[];
  onActiveTabChange?: (tab: TabModel | undefined) => void;
  onTabsChange?: (tabs: TabModel[]) => void;
  apiRef?: React.Ref<TabsApi | undefined>;
};

type State = {
  readonly tabs: TabModel[];
  readonly activeTabId: string | undefined;
};

type Action =
  | {
      type: "close-tab";
      tab: TabModel;
      onActiveTabChange?: (tab: TabModel | undefined) => void;
      onTabsChange?: (tab: TabModel[]) => void;
    }
  | {
      type: "set-tabs";
      tabs: TabModel[];
      onTabsChange?: (tab: TabModel[]) => void;
    }
  | {
      type: "set-active-tab-id";
      id: string | undefined;
      onActiveTabChange?: (tab: TabModel | undefined) => void;
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "close-tab": {
      const { tab, onTabsChange, onActiveTabChange } = action;
      const { tabs, activeTabId: prevActiveId, ...rest } = state;

      const prevActiveTab = tabs.find((tab) => tab.id === prevActiveId);
      const activeTab =
        prevActiveId === tab.id ? closestItem(tabs, tab) : prevActiveTab;

      const updatedTabs = removeItem(tabs, tab);

      onTabsChange?.(updatedTabs);
      onActiveTabChange?.(activeTab);

      return {
        tabs: updatedTabs,
        activeTabId: activeTab?.id,
        ...rest,
      };
    }
    case "set-tabs": {
      const { tabs, onTabsChange } = action;
      onTabsChange?.(tabs);
      return {
        ...state,
        tabs,
      };
    }
    case "set-active-tab-id": {
      const { id, onActiveTabChange } = action;
      const activeTab = state.tabs.find((tab) => tab.id === id);
      onActiveTabChange?.(activeTab);
      return {
        ...state,
        activeTabId: id,
      };
    }
  }
}

export function Tabs(props: TabsProps) {
  const {
    onActiveTabChange = noop,
    apiRef,
    activeTabId: activeTabIdProp,
    hasControlledActiveTabId,
    tabs: tabsProp,
    onTabsChange,
  } = props;

  const [state, dispatch] = useReducer(reducer, {
    tabs: [],
    activeTabId: undefined,
  });

  useImperativeHandle(apiRef, () => ({
    setTabs: (tabsArg) => {
      const tabs =
        typeof tabsArg === "function" ? tabsArg(state.tabs) : tabsArg;
      dispatch({
        type: "set-tabs",
        tabs,
        onTabsChange,
      });
    },
    setActiveTabId: (id: string) => {
      dispatch({
        type: "set-active-tab-id",
        id,
        onActiveTabChange,
      });
    },
    getTabs: () => state.tabs,
  }));

  const { tabs, activeTabId } = state;

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const closeTab = (tab: TabModel) => {
    dispatch({
      type: "close-tab",
      tab,
      onTabsChange,
      onActiveTabChange,
    });
  };

  useEffect(() => {
    if (hasControlledActiveTabId) {
      dispatch({
        type: "set-active-tab-id",
        id: activeTabIdProp,
      });
    }
  }, [hasControlledActiveTabId, activeTabIdProp]);

  useEffect(() => {
    if (tabsProp) {
      dispatch({
        type: "set-tabs",
        tabs: tabsProp,
      });
    }
  }, [tabsProp]);

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
