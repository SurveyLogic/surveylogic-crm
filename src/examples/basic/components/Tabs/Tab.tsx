import { TabModel } from "src/lib/tabs";
import { noop } from "src/utils/noop.ts";
import { MouseEventHandler } from "react";
import { css } from "@emotion/react";

export function Tab(props: {
  tab: TabModel;
  isPinned: boolean;
  isActive: boolean;
  onClose?: (tab: TabModel) => void;
  onActiveTabIdChange?: (id: string | undefined) => void;
}) {
  const {
    tab,
    isActive,
    onClose = noop,
    onActiveTabIdChange = noop,
    isPinned,
  } = props;

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
