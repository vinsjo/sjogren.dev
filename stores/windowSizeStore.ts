import { WH, WindowSize, getScreenSize, getWindowSize } from '@utils/misc';
import { createStoreSelectors } from '@utils/zustand/createStoreSelectors';
import { isShallowEqual } from 'x-is-equal';
import { create } from 'zustand';

export interface WindowSizeStore {
    windowSize: WindowSize;
    screenSize: WH;
    setWindowSize: (size: WindowSize) => void;
    setScreenSize: (size: WH) => void;
}

export const useWindowSizeStore = create<WindowSizeStore>((set, get) => ({
    windowSize: getWindowSize(),
    screenSize: getScreenSize(),
    setWindowSize: (windowSize) => {
        const prevSize = get().windowSize;
        if (isShallowEqual(windowSize, prevSize)) return;
        set({ windowSize });
    },
    setScreenSize: (screenSize) => {
        const prevSize = get().screenSize;
        if (isShallowEqual(screenSize, prevSize)) return;
        set({ screenSize });
    },
}));

export const selectors = createStoreSelectors(useWindowSizeStore);

export const useWindowSize = () => useWindowSizeStore(selectors.windowSize);
export const useScreenSize = () => useWindowSizeStore(selectors.screenSize);
