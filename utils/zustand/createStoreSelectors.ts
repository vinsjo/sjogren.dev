import { StoreApi } from 'zustand';
import { objectKeys } from '@/utils/misc';

export function createStoreSelectors<T extends object>(storeApi: StoreApi<T>) {
  const output = {} as { [K in keyof T]: (state: T) => T[K] };

  objectKeys(storeApi.getState()).forEach((key) => {
    output[key] = (state) => state[key];
  });

  return output;
}
