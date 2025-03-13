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
      css={tabStyles({
        isActive,
      })}
    >
      <span className={!isPinned ? "truncate-on-hover tab-title" : "tab-title"}>
        {tab.title}
      </span>

      {!isPinned && (
        <span
          className={"tab-close-trigger"}
          css={closeTriggerStyles}
          onClick={handleClose}
        />
      )}
    </div>
  );
}

const tabStyles = ({ isActive }: { isActive: boolean }) => css`
  display: flex;
  align-items: center;
  font-size: 13px;
  position: relative;
  padding: 6px 14px 6px 10px;
  cursor: pointer;
  user-select: none;

  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);

  --gradient: linear-gradient(
    to bottom,
    rgba(237, 237, 237, 1) 0%,
    rgba(246, 246, 246, 1) 53%,
    rgba(247, 247, 247, 1) 100%
  );

  border-top: 1px solid ${isActive ? "transparent" : "var(--border-color)"};
  box-shadow: ${isActive ? "0 -5px 10px -6px var(--color-primary)" : "none"};
  background: ${isActive ? "white" : "var(--gradient)"};

  :hover {
    .tab-close-trigger {
      display: block;
    }

    .tab-title {
      opacity: 0.5;
    }

    .truncate-on-hover {
      overflow: hidden;
      display: block;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: calc(100% - 3px);
    }
  }

  :after {
    content: ${isActive ? '""' : "none"};

    right: 0;
    top: -1px;
    height: 3px;
    background: var(--color-primary);
    position: absolute;
    transform: translateX(1px);
    width: calc(100% + 2px);
  }
  :before {
    position: absolute;
    content: ${isActive ? '""' : "none"};
    width: 100%;
    background: white;
    height: 1px;
    bottom: -1px;
    left: 0;
  }
`;

const closeTriggerStyles = css`
  position: absolute;
  top: 50%;
  transform-origin: center;
  transform: translateY(-50%);
  right: 7px;

  :after,
  :before {
    position: absolute;
    top: 50%;
    left: 50%;
    content: "";
    width: 2px;
    height: 8px;
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(45deg);
    background-color: white;
  }

  :before {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  background-color: #a33b3b;
  opacity: 0.7;
  align-items: center;
  width: 11px;
  height: 11px;
  border-radius: 10px;

  display: none;

  :hover {
    opacity: 1;
  }
`;
