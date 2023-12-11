import { objectKeys } from '@utils/misc';
import { StoreApi, UseBoundStore } from 'zustand';

export const createStoreSelectors = <T extends object>(
  store: StoreApi<T> | UseBoundStore<StoreApi<T>>
) => {
  return Object.fromEntries(
    objectKeys(store.getState()).map((key) => [key, (state: T) => state[key]])
  ) as { [key in keyof T]: (state: T) => T[key] };
};
