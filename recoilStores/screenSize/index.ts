import { atom } from 'recoil';

export type ScreenSizeState = {
    width: number;
    height: number;
};
const screenSizeState = atom<ScreenSizeState>({
    key: 'ScreenSizeState',
    default: { width: 0, height: 0 },
});

export default screenSizeState;
