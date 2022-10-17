import { atom, selector } from 'recoil';
import { isWindowSize, type WindowSize } from '@utils/misc';

const windowSize = atom<WindowSize>({
    key: 'WindowSizeState',
    default: { innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
});

const windowSizeState = selector<WindowSize>({
    key: 'WindowSizeSelector',
    get: ({ get }) => get(windowSize),
    set: ({ get, set }, size: WindowSize) => {
        if (!isWindowSize(size)) return;
        const prev = get(windowSize);
        if (Object.keys(prev).every((key) => size[key] === prev[key])) return;
        set(windowSize, size);
    },
});

export default windowSizeState;
export type { WindowSize };
