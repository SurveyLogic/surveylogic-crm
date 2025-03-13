import { useRef } from "react";
import { noop } from "src/utils/noop.ts";
import { Tab } from "./Tab.tsx";
import { TabsApi, TabsProps, useTabs } from "src/lib/tabs/useTabs.tsx";
import { css } from "@emotion/react";

export function Tabs(props: TabsProps) {
  const { onActiveTabIdChange = noop, apiRef: apiRefProp } = props;

  const localApiRef = useRef<TabsApi>({} as TabsApi);
  const apiRef = localApiRef || apiRefProp;

  useTabs(apiRef, props);

  const { tabs, startPinnedTabs, activeTabId } = apiRef.current.getState();

  return (
    <div css={rootStyles}>
      {tabs.map((tab) => (
        <Tab
          onActiveTabIdChange={onActiveTabIdChange}
          onClose={apiRef.current.closeTab}
          isPinned={startPinnedTabs.includes(tab.id)}
          isActive={activeTabId === tab.id}
          tab={tab}
          key={tab.id}
        />
      ))}
    </div>
  );
}

const rootStyles = css`
  display: flex;
  height: 28px;
  column-gap: 2px;
`;
