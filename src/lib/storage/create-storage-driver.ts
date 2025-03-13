export type StorageKey = {
  version: string;
  name: string;
};

export const createStorageDriver = (storage: Storage) => {
  const get = <V>(key: StorageKey): V | null => {
    const value = storage.getItem(key.name);
    if (!value) {
      return null;
    }
    try {
      const result = JSON.parse(value);
      if (result?.version !== key.version) {
        remove(key);
        return null;
      }
      return result?.state;
    } catch (e) {
      // todo: log this
      return null;
    }
  };

  const set = (key: StorageKey, value: any) => {
    storage.setItem(
      key.name,
      JSON.stringify({
        state: value,
        version: key.version,
      }),
    );
  };

  const remove = (key: StorageKey) => {
    storage.removeItem(key.name);
  };

  return {
    get,
    set,
    remove,
  };
};

export type StorageDriver = ReturnType<typeof createStorageDriver>;
