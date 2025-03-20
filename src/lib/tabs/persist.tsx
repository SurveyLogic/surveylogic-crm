import { TabModel, ValidTabMeta } from "src/lib/tabs/tabs.types.ts";
import {
  StorageDriver,
  StorageKey,
} from "src/lib/storage/create-storage-driver.ts";
import { useCallback } from "react";
import { Outlet } from "react-router-dom";

const serializeTabModel = (model: TabModel<any>): Partial<TabModel<any>> => {
  return {
    title: model.title,
    isClosable: model.isClosable,
    id: model.id,
    meta: model.meta,
  };
};

const deserializeTabModel = (tab: TabModel<any>) => ({
  ...tab,
  content: <Outlet />,
});

export const usePersistTabs = <Meta extends ValidTabMeta = ValidTabMeta>({
  storageKey,
  storage,
}: {
  storageKey: StorageKey;
  storage: StorageDriver;
}) => {
  return {
    getTabsFromStorage: useCallback(
      () =>
        (storage.get<TabModel<Meta>[]>(storageKey) || []).map(
          deserializeTabModel,
        ),
      [storageKey, storage],
    ),
    persistTabs: useCallback(
      (tabs: TabModel<Meta>[]) => {
        const onUnload = () => {
          // save on window close
          // it doesn't make sense for memory storage
          storage.set(storageKey, tabs.map(serializeTabModel));
        };
        window.addEventListener("unload", onUnload);
        return () => {
          window.removeEventListener("unload", onUnload);
          // save on unmount
          storage.set(storageKey, tabs.map(serializeTabModel));
        };
      },
      [storageKey, storage],
    ),
  };
};
