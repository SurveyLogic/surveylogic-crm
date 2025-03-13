import "./Tabs.css";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { noop } from "src/utils/noop.ts";
import { removeItem } from "src/utils/array-utils.ts";
import { closestItem, TabModel } from "src/lib/tabs";
import { Tab } from "src/components/Tabs/Tab.tsx";

export type TabsApi = {
  setTabs: (tabs: TabModel[]) => void;
  setActiveTabId: (id: string | undefined) => void;
  getState: () => State;
};

type TabsProps = {
  hasControlledActiveTabId?: boolean;
  activeTabId?: string;
  startPinnedTabs?: string[];
  tabs?: TabModel<any>[];
  onActiveTabIdChange?: (id: string | undefined) => void;
  onStartPinnedTabsChange?: (ids: string[]) => void;
  onTabsChange?: (tabs: TabModel<any>[]) => void;
  apiRef?: React.Ref<TabsApi | undefined>;
};

type State = {
  tabs: TabModel[];
  activeTabId: string | undefined;
  startPinnedTabs: string[];
};

const useForceRerender = () => {
  const [, setIncrement] = useState(0);
  return useCallback(() => {
    setIncrement((prev) => prev + 1);
  }, []);
};

export function Tabs(props: TabsProps) {
  const {
    onActiveTabIdChange = noop,
    apiRef,
    activeTabId: activeTabIdProp,
    startPinnedTabs: startPinnedTabsProp,
    hasControlledActiveTabId,
    tabs: tabsProp,
    onTabsChange,
    onStartPinnedTabsChange,
  } = props;

  const forceRerender = useForceRerender();

  const stateRef = useRef<State>({
    tabs: [],
    activeTabId: undefined,
    startPinnedTabs: [],
  });

  const getState = () => {
    return stateRef.current;
  };

  const setState = useCallback(
    (
      stateOrFn: Partial<State> | { (state: Partial<State>): State },
      runHandlers = true,
    ) => {
      const newState =
        typeof stateOrFn === "function"
          ? stateOrFn(stateRef.current)
          : stateOrFn;

      const handlersMap: {
        tabs?: (tabs: TabModel[]) => void;
        activeTabId?: (id: string | undefined) => void;
        startPinnedTabs?: (ids: string[]) => void;
      } = {
        tabs: onTabsChange,
        activeTabId: onActiveTabIdChange,
        startPinnedTabs: onStartPinnedTabsChange,
      };

      const subStateKeys: (keyof State)[] = Object.keys(
        newState,
      ) as unknown as (keyof State)[];

      if (runHandlers) {
        subStateKeys.forEach((subStateKey) => {
          const subState = newState[subStateKey];
          const subStateHandler = handlersMap[subStateKey];
          // @ts-ignore
          subStateHandler?.(subState);
        });
      }

      stateRef.current = {
        ...stateRef.current,
        ...newState,
      };
    },
    [onActiveTabIdChange, onTabsChange, onStartPinnedTabsChange],
  );

  const closeTab = useCallback(
    (tab: TabModel) => {
      const { tabs, activeTabId: prevActiveId, startPinnedTabs } = getState();

      const prevActiveTab = tabs.find((tab) => tab.id === prevActiveId);
      const activeTab =
        prevActiveId === tab.id ? closestItem(tabs, tab) : prevActiveTab;

      const updatedTabs = removeItem(tabs, tab);

      setState({
        tabs: updatedTabs,
        activeTabId: activeTab?.id,
        startPinnedTabs: startPinnedTabs.filter((id) => id !== tab.id),
      });

      forceRerender();
    },
    [forceRerender, setState],
  );

  const setStartPinnedTabs = useCallback(
    (ids: string[], runHandlers = true) => {
      setState(
        {
          startPinnedTabs: ids,
        },
        runHandlers,
      );
      forceRerender();
    },
    [forceRerender, setState],
  );

  const setTabs = useCallback(
    (tabs: TabModel[], runHandlers = true) => {
      setState(
        {
          tabs,
        },
        runHandlers,
      );
      forceRerender();
    },
    [forceRerender, setState],
  );

  const setActiveTabId = useCallback(
    (id: string | undefined, runHandlers = true) => {
      setState(
        {
          activeTabId: id,
        },
        runHandlers,
      );
      forceRerender();
    },
    [forceRerender, setState],
  );

  useImperativeHandle(apiRef, () => ({
    setTabs,
    setActiveTabId,
    getState,
  }));

  const { tabs, activeTabId, startPinnedTabs } = getState();

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  useEffect(() => {
    if (hasControlledActiveTabId) {
      setActiveTabId(activeTabIdProp, false);
    }
  }, [hasControlledActiveTabId, activeTabIdProp, setActiveTabId]);

  useEffect(() => {
    if (tabsProp) {
      setTabs(tabsProp, false);
    }
  }, [tabsProp, setTabs]);

  useEffect(() => {
    if (startPinnedTabsProp) {
      setStartPinnedTabs(startPinnedTabsProp, false);
    }
  }, [startPinnedTabsProp, setStartPinnedTabs]);

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <Tab
          onActiveTabIdChange={onActiveTabIdChange}
          onClose={closeTab}
          isPinned={startPinnedTabs.includes(tab.id)}
          isActive={activeTab?.id === tab.id}
          tab={tab}
          key={tab.id}
        />
      ))}
    </div>
  );
}
