import { DeviceType } from '@utils/misc';
import { createStoreSelectors } from '@utils/zustand/createStoreSelectors';
import { create } from 'zustand';

export interface DeviceTypeStore {
    type: DeviceType | null;
    isMobile: boolean;
    setDeviceType: (type: DeviceType) => void;
}

export const useDeviceTypeStore = create<DeviceTypeStore>((set, get) => ({
    type: null,
    isMobile: false,
    setDeviceType: (type) => {
        if (get().type === type) return;
        set({ type, isMobile: ['mobile', 'tablet'].includes(type) });
    },
}));

export const selectors = createStoreSelectors(useDeviceTypeStore);

export const useIsMobile = () => useDeviceTypeStore(selectors.isMobile);
