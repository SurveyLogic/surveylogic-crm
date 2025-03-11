import "./Tabs.css";
import React, {useImperativeHandle, useReducer} from "react";
import { noop } from "src/utils/noop.ts";
import {  removeItem } from "src/utils/array-utils.ts";
import {
  closestItem,
  TabModel,
} from "src/tabbed-navigation.tsx";
import { Tab } from "src/components/Tabs/Tab.tsx";

export type TabsApi = {
  setTabs: (tabs: TabModel[] | {(prevTabs: TabModel[]) :TabModel[]}) => void;
  setActiveTabId: (id: string)  => void;
}

type TabsProps = {
  storeKey: string;
  onActiveTabChange?: (tab: TabModel | undefined) => void;
  apiRef?: React.Ref<TabsApi | undefined>;
};

type State = {
  readonly tabs: TabModel[];
  readonly activeTabId: string | undefined;
}

type Action =
  | {
  type: 'close-tab'
  tab: TabModel
} | {
  type: 'set-tabs'
  tabs: TabModel[]
}| {
  type: 'set-active-tab-id'
  id: string;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'close-tab': {
      const {tab} = action;
      const {tabs, activeTabId: prevActiveId, ...rest} = state;

      const activeTabId = prevActiveId === tab.id ? closestItem(tabs, tab)?.id: prevActiveId;
      return {
        tabs: removeItem(tabs, tab),
        activeTabId: activeTabId === tab.id ? closestItem(tabs, tab)?.id: activeTabId,
        ...rest
      }
    }
    case 'set-tabs': {
      const {tabs} = action;

      return {
        ...state,
        tabs,
      }
    }
    case 'set-active-tab-id': {
      const {id} = action;

      return {
        ...state,
        activeTabId: id,
      }
    }
  }
}

export function Tabs(props: TabsProps) {
  const { onActiveTabChange = noop, apiRef } = props;

  const [state, dispatch] = useReducer(reducer, {
    tabs: [],
    activeTabId: undefined,
  });

  useImperativeHandle(apiRef, () => ({
    setTabs: (tabsArg) => {
      const tabs = typeof tabsArg === 'function' ? tabsArg(state.tabs): tabsArg;
      dispatch({
        type: 'set-tabs',
        tabs
      })
    },
    setActiveTabId: (id: string) => {
      dispatch({
        type: 'set-active-tab-id',
        id
      })
    }
  }))

  const {tabs, activeTabId} = state;

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const closeTab = (tab: TabModel) => {
    dispatch({
      type: 'close-tab',
      tab
    })
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

