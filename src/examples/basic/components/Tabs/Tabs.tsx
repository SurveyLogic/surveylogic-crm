import { useRef } from "react";
import { noop } from "src/utils/noop.ts";
import { Tab } from "src/examples/basic/components/Tabs/Tab.tsx";
import { TabsApi, TabsProps, useTabs } from "src/lib/tabs/useTabs.tsx";
import { css } from "@emotion/react";
import { TabProvider, TabsApiProvider } from "src/lib/tabs/tabs.components.tsx";

export function Tabs(props: TabsProps) {
  const { onActiveTabIdChange = noop, apiRef: apiRefProp } = props;
  const localApiRef = useRef<TabsApi>({} as TabsApi);
  const apiRef = localApiRef || apiRefProp;

  useTabs(apiRef, props);

  const { tabs, activeTabId } = apiRef.current.getState();

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
      {tabs.map(
        (tab) =>
          activeTabId === tab.id && (
            <TabProvider tab={tab} key={tab.id}>
              {tab.content}
            </TabProvider>
          ),
      )}
    </TabsApiProvider>
  );
}

const rootStyles = css`
  display: flex;
  border-bottom: 1px solid #eee;
  height: 40px;
`;
