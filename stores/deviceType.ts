import { create } from 'zustand';
import { DeviceType, getDeviceType, isMobileDeviceType } from 'utils/misc';
import { createStoreSelectors } from 'utils/zustand/createStoreSelectors';

export interface DeviceTypeStore {
  type: Nullable<DeviceType>;
  isMobile: boolean;
  setDeviceType: (type: Nullable<DeviceType>) => void;
}

export const useDeviceTypeStore = create<DeviceTypeStore>((set) => {
  const initialType = getDeviceType();

  return {
    type: initialType,
    isMobile: isMobileDeviceType(initialType),
    setDeviceType: (type) => {
      set((prev) =>
        prev.type === type ? prev : { type, isMobile: isMobileDeviceType(type) }
      );
    },
  };
});

export const selectors = createStoreSelectors(useDeviceTypeStore);

export const useIsMobile = () => useDeviceTypeStore(selectors.isMobile);
