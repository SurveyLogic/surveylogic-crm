import { createStorageDriver } from "src/lib/storage/create-storage-driver.ts";

const memoryStorageMap = new Map();

export const memoryStorage: Storage = {
  getItem: (storageKey: string) => {
    return memoryStorageMap.get(storageKey);
  },
  setItem(key: string, value: string) {
    return memoryStorageMap.set(key, value);
  },
  removeItem(key: string) {
    memoryStorageMap.delete(key);
  },
  clear() {
    memoryStorageMap.clear();
  },
  get length() {
    return memoryStorageMap.size;
  },
  key(index: number) {
    return [...memoryStorageMap.keys()][index];
  },
};

export const memoryStorageDriver = createStorageDriver(memoryStorage);

export const {
  get: getFromMemoryStorage,
  set: setToMemoryStorage,
  remove: removeFromMemoryStorage,
} = memoryStorageDriver;
