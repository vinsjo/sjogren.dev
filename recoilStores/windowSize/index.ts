import { atom } from 'recoil';

export type WindowSizeState = {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
};

const windowSizeState = atom<WindowSizeState>({
    key: 'WindowSizeState',
    default: { innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
});

export default windowSizeState;
