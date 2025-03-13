import { TabModel } from "src/lib/tabs";
import { noop } from "src/utils/noop.ts";
import { MouseEventHandler } from "react";

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

  const className = ["tab", isActive && "active"].filter(Boolean).join(" ");

  const handleClose: MouseEventHandler = (e) => {
    e.stopPropagation();
    onClose(tab);
  };

  return (
    <div
      onClick={() => onActiveTabIdChange(tab.id)}
      key={tab.id}
      className={className}
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
