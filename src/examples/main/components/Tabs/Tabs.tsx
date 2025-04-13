import { useEffect, useRef } from "react";
import { noop } from "src/utils/noop.ts";
import { Tab } from "./Tab.tsx";
import { TabsApi, TabsProps, useTabs } from "src/lib/tabs/useTabs.tsx";
import { css } from "@emotion/react";
import { TabProvider, TabsApiProvider } from "src/lib/tabs/tabs.components.tsx";
import {
  useTabContext,
  useTabsApiRefContext,
} from "src/lib/tabs/tabs.hooks.ts";

export function Tabs(props: TabsProps) {
  const { onActiveTabIdChange = noop, apiRef: apiRefProp } = props;

  const localApiRef = useRef<TabsApi>({} as TabsApi);
  const apiRef = localApiRef || apiRefProp;

  useTabs(apiRef, props);

  const { tabs, activeTabId } = apiRef.current.getState();

  const parentApiRef = useTabsApiRefContext();
  const parentTab = useTabContext();

  if (parentTab && parentApiRef) {
    // register this tabs on parent tab
    parentApiRef.current.registerChildTabsApi(parentApiRef.current);
    apiRef.current.registerParentTabsApi(parentApiRef.current);
  }

  useEffect(() => {
    const parentApi = parentApiRef?.current;
    return () => {
      parentApi?.unregisterChildTabsApi?.();
    };
  }, [parentApiRef]);

  return (
    <TabsApiProvider apiRef={apiRef}>
      <div css={rootStyles}>
        {tabs.map((tab) => (
          <TabProvider tab={tab} key={tab.id}>
            <Tab
              onActiveTabIdChange={onActiveTabIdChange}
              onClose={apiRef.current.closeTab}
            />
          </TabProvider>
        ))}
      </div>
      <div css={tabContentStyles}>
        {tabs.map(
          (tab) =>
            activeTabId === tab.id && (
              <TabProvider tab={tab} key={tab.id}>
                {tab.content}
              </TabProvider>
            ),
        )}
      </div>
    </TabsApiProvider>
  );
}
const tabContentStyles = css`
  flex-grow: 1;
  border: 1px solid var(--border-color);
  padding: 10px;
`;

const rootStyles = css`
  display: flex;
  height: 28px;
  column-gap: 2px;
`;
