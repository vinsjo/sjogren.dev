import { atom, selector } from 'recoil';
import { isWH, type ScreenSize } from '@utils/misc';

const screenSize = atom<ScreenSize>({
    key: 'ScreenSizeState',
    default: { width: 0, height: 0 },
});

const screenSizeState = selector({
    key: 'ScreenSizeSelector',
    get: ({ get }) => get(screenSize),
    set: ({ get, set }, size: ScreenSize) => {
        if (!isWH(size)) return;
        const prev = get(screenSize);
        if (Object.keys(prev).every((key) => prev[key] === size[key])) return;
        set(screenSize, size);
    },
});

export default screenSizeState;
export type { ScreenSize };
