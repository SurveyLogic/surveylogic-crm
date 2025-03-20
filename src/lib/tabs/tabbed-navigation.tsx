import { DataRouteMatch, UIMatch } from "react-router-dom";
import { Handle, TabHandle } from "src/lib/tabs";

export const getTabHandle =
  (key: string) =>
  (match: DataRouteMatch): TabHandle | undefined => {
    return (match.route?.handle as Handle | undefined)?.tabs.find(
      (tabHandle: TabHandle) => tabHandle.key === key,
    );
  };

export const getTabHandleUI =
  (key: string) =>
  (match: UIMatch<any, Handle>): TabHandle | undefined => {
    return match?.handle?.tabs.find(
      (tabHandle: TabHandle) => tabHandle.key === key,
    );
  };
