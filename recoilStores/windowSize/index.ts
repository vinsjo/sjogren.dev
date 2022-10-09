import { atom } from 'recoil';
import type { WindowSize } from '@utils/misc';

const windowSizeState = atom<WindowSize>({
    key: 'WindowSizeState',
    default: { innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
});

export default windowSizeState;
