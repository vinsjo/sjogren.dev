import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { WH, WindowSize, getScreenSize, getWindowSize } from '@/utils/misc';
import { createStoreSelectors } from '@/utils/zustand/createStoreSelectors';

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
    if (shallow(windowSize, prevSize)) return;
    set({ windowSize });
  },
  setScreenSize: (screenSize) => {
    const prevSize = get().screenSize;
    if (shallow(screenSize, prevSize)) return;
    set({ screenSize });
  },
}));

export const selectors = createStoreSelectors(useWindowSizeStore);
