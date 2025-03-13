import { createStorageDriver } from "src/lib/storage/create-storage-driver.ts";

export const localStorageDriver = createStorageDriver(localStorage);

export const {
  get: getFromLocalStorage,
  set: setToLocalStorage,
  remove: removeFromLocalStorage,
} = localStorageDriver;
