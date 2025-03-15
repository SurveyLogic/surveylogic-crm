import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { TabModel } from "src/lib/tabs/tabs.types.ts";
import { closestItem } from "src/lib/tabs/tabs.utils.ts";
import { removeItem } from "src/utils/array-utils.ts";

export type TabsApi = {
  setTabs: (tabs: TabModel[], runHandlers?: boolean) => void;
  setActiveTabId: (id: string | undefined, runHandlers?: boolean) => void;
  getState: () => State;
  setState: (
    state: Partial<State> | { (prevState: State): Partial<State> },
    runHandlers?: boolean,
  ) => void;
  forceUpdate: () => void;
  closeTab: (tab: TabModel) => void;
};

export type TabsProps = {
  hasControlledActiveTabId?: boolean;
  activeTabId?: string;
  initialActiveTabId?: string;
  startPinnedTabs?: string[];
  endPinnedTabs?: string[];
  tabs?: TabModel<any>[];
  initialTabs?: TabModel<any>[];
  initialStartPinnedTabs?: string[];
  initialEndPinnedTabs?: string[];
  onActiveTabIdChange?: (id: string | undefined) => void;
  onStartPinnedTabsChange?: (ids: string[]) => void;
  onEndPinnedTabsChange?: (ids: string[]) => void;
  onTabsChange?: (tabs: TabModel<any>[]) => void;
  apiRef?: React.Ref<TabsApi | undefined>;
};

export type State = {
  tabs: TabModel[];
  activeTabId: string | undefined;
  startPinnedTabs: string[];
  endPinnedTabs: string[];
};

const useForceRerender = () => {
  const [, setIncrement] = useState(0);
  return useCallback(() => {
    setIncrement((prev) => prev + 1);
  }, []);
};

const useClosing = (apiRef: MutableRefObject<TabsApi>) => {
  apiRef.current["closeTab"] = (tab: TabModel) => {
    const {
      tabs,
      activeTabId: prevActiveId,
      startPinnedTabs,
    } = apiRef.current.getState();

    const prevActiveTab = tabs.find((tab) => tab.id === prevActiveId);
    const activeTab =
      prevActiveId === tab.id ? closestItem(tabs, tab) : prevActiveTab;

    const updatedTabs = removeItem(tabs, tab);

    apiRef.current.setState({
      tabs: updatedTabs,
      activeTabId: activeTab?.id,
      startPinnedTabs: startPinnedTabs.filter((id) => id !== tab.id),
    });

    apiRef.current.forceUpdate();
  };
};

const useActive = (apiRef: MutableRefObject<TabsApi>, props: TabsProps) => {
  const { hasControlledActiveTabId, activeTabId } = props;
  apiRef.current["setActiveTabId"] = (
    id: string | undefined,
    runHandlers = true,
  ) => {
    apiRef.current.setState(
      {
        activeTabId: id,
      },
      runHandlers,
    );
    apiRef.current.forceUpdate();
  };
  useEffect(() => {
    if (hasControlledActiveTabId) {
      apiRef.current.setActiveTabId(activeTabId, false);
    }
  }, [hasControlledActiveTabId, activeTabId, apiRef]);
};

const useTabsState = (apiRef: MutableRefObject<TabsApi>, props: TabsProps) => {
  const {
    onTabsChange,
    onActiveTabIdChange,
    onStartPinnedTabsChange,
    onEndPinnedTabsChange,
    initialTabs = [],
    initialActiveTabId,
    initialStartPinnedTabs = [],
    initialEndPinnedTabs = [],
  } = props;
  const handlersMapRef = useRef<{
    tabs?: (tabs: TabModel[]) => void;
    activeTabId?: (id: string | undefined) => void;
    startPinnedTabs?: (ids: string[]) => void;
    endPinnedTabs?: (ids: string[]) => void;
  }>({
    tabs: onTabsChange,
    activeTabId: onActiveTabIdChange,
    startPinnedTabs: onStartPinnedTabsChange,
    endPinnedTabs: onEndPinnedTabsChange,
  });

  const stateRef = useRef<State>({
    tabs: initialTabs,
    activeTabId: initialActiveTabId,
    startPinnedTabs: initialStartPinnedTabs,
    endPinnedTabs: initialEndPinnedTabs,
  });

  apiRef.current["getState"] = () => {
    return stateRef.current;
  };

  apiRef.current["setState"] = (
    stateOrFn: Partial<State> | { (state: State): Partial<State> },
    runHandlers = true,
  ) => {
    const newState =
      typeof stateOrFn === "function" ? stateOrFn(stateRef.current) : stateOrFn;

    const subStateKeys: (keyof State)[] = Object.keys(
      newState,
    ) as unknown as (keyof State)[];

    if (runHandlers) {
      subStateKeys.forEach((subStateKey) => {
        const subState = newState[subStateKey];
        const subStateHandler = handlersMapRef.current[subStateKey];
        // @ts-ignore
        subStateHandler?.(subState);
      });
    }

    stateRef.current = {
      ...stateRef.current,
      ...newState,
    };
  };
};

const usePinning = (apiRef: MutableRefObject<TabsApi>, props: TabsProps) => {
  const {
    startPinnedTabs: startPinnedTabsProp,
    endPinnedTabs: endPinnedTabsProp,
  } = props;
  const setStartPinnedTabs = useCallback(
    (ids: string[], runHandlers = true) => {
      apiRef.current.setState(
        {
          startPinnedTabs: ids,
        },
        runHandlers,
      );
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const setEndPinnedTabs = useCallback(
    (ids: string[], runHandlers = true) => {
      apiRef.current.setState(
        {
          endPinnedTabs: ids,
        },
        runHandlers,
      );
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  useEffect(() => {
    if (startPinnedTabsProp) {
      setStartPinnedTabs(startPinnedTabsProp, false);
    }
  }, [startPinnedTabsProp, setStartPinnedTabs]);

  useEffect(() => {
    if (endPinnedTabsProp) {
      setEndPinnedTabs(endPinnedTabsProp, false);
    }
  }, [endPinnedTabsProp, setEndPinnedTabs]);
};

const useTabModels = (apiRef: MutableRefObject<TabsApi>, props: TabsProps) => {
  const { tabs: tabsProp } = props;
  apiRef.current["setTabs"] = (tabs: TabModel[], runHandlers = true) => {
    apiRef.current.setState(
      {
        tabs,
      },
      runHandlers,
    );
    apiRef.current.forceUpdate();
  };

  useEffect(() => {
    if (tabsProp) {
      apiRef.current.setTabs(tabsProp, false);
    }
  }, [tabsProp, apiRef]);
};

export const useTabs = (
  apiRef: MutableRefObject<TabsApi>,
  props: TabsProps,
) => {
  apiRef.current["forceUpdate"] = useForceRerender();

  useTabModels(apiRef, props);
  useTabsState(apiRef, props);
  useClosing(apiRef);
  usePinning(apiRef, props);
  useActive(apiRef, props);
};
