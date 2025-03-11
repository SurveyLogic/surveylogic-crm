import { TabModel } from "src/tabbed-navigation.tsx";
import { noop } from "src/utils/noop.ts";
import { MouseEventHandler } from "react";

export function Tab(props: {
  tab: TabModel;
  isActive: boolean;
  onClose?: (tab: TabModel) => void;
  onActiveTabChange?: (tab: TabModel | undefined) => void;
}) {
  const { tab, isActive, onClose = noop, onActiveTabChange = noop } = props;

  const className = ["tab", isActive && "active"].filter(Boolean).join(" ");

  const handleClose: MouseEventHandler = (e) => {
    e.stopPropagation();
    onClose(tab);
  };

  return (
    <div
      onClick={() => onActiveTabChange(tab)}
      key={tab.id}
      className={className}
    >
      {tab.title}
      <span className={"close-trigger"} onClick={handleClose}>
        x
      </span>
    </div>
  );
}

