import { DeviceType, getDeviceType, isMobileDeviceType } from '@utils/misc';
import { createStoreSelectors } from '@utils/zustand/createStoreSelectors';
import { create } from 'zustand';

export interface DeviceTypeStore {
  type: DeviceType | null;
  isMobile: boolean;
  setDeviceType: (type: DeviceType | null) => void;
}

const getState = (
  type?: DeviceType | null
): Omit<DeviceTypeStore, 'setDeviceType'> => {
  if (type === undefined) {
    type = getDeviceType();
  }
  return { type, isMobile: isMobileDeviceType(type) };
};

export const useDeviceTypeStore = create<DeviceTypeStore>((set, get) => ({
  ...getState(),
  setDeviceType: (type) => {
    if (get().type !== type) {
      set(getState(type));
    }
  },
}));

export const selectors = createStoreSelectors(useDeviceTypeStore);

export const useIsMobile = () => useDeviceTypeStore(selectors.isMobile);
