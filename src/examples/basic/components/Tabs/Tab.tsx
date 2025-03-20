import { TabModel } from "src/lib/tabs";
import { noop } from "src/utils/noop.ts";
import { MouseEventHandler } from "react";
import { css } from "@emotion/react";
import {
  useTabContext,
  useTabsApiRefContext,
} from "src/lib/tabs/tabs.hooks.ts";

export function Tab(props: {
  onClose?: (tab: TabModel) => void;
  onActiveTabIdChange?: (id: string | undefined) => void;
}) {
  const { onClose = noop, onActiveTabIdChange = noop } = props;

  const tab = useTabContext();
  if (!tab) {
    throw new Error("this is bug in Tab component, tab must be present");
  }
  const apiRef = useTabsApiRefContext();
  if (!apiRef) {
    throw new Error("this is bug in Tab component, api must be present");
  }
  const { activeTabId, startPinnedTabs } = apiRef.current.getState();

  const isPinned = startPinnedTabs.includes(tab.id);
  const isActive = tab.id === activeTabId;

  const handleClose: MouseEventHandler = (e) => {
    e.stopPropagation();
    onClose(tab);
  };

  return (
    <div
      onClick={() => onActiveTabIdChange(tab.id)}
      key={tab.id}
      css={[tabStyles, isActive && activeTabStyles]}
    >
      {tab.title}

      {!isPinned && (
        <span className={"close-trigger"} onClick={handleClose}>
          x
        </span>
      )}
    </div>
  );
}

const activeTabStyles = css`
  :after {
    content: "";
  }
`;

const tabStyles = css`
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 16px;
  cursor: pointer;
  user-select: none;

  :hover {
    background: #eee;

    .close-trigger {
      opacity: 1;
    }
  }

  :after {
    content: none;
    right: 0;
    top: 0;
    width: 100%;
    height: 3px;
    background: #0061fb;
    position: absolute;
  }

  .close-trigger {
    opacity: 0;
    margin-left: 16px;
  }
`;
