import { objectKeys } from '@utils/misc';
import { StoreApi, UseBoundStore } from 'zustand';

export const createStoreSelectors = <T>(
    store: StoreApi<T> | UseBoundStore<StoreApi<T>>
): { [key in keyof T]: (state: T) => T[key] } => {
    const keys = objectKeys(store.getState());
    return Object.assign({}, ...keys.map((key) => (state: T) => state[key]));
};
