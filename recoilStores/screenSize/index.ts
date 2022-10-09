import { atom } from 'recoil';
import type { ScreenSize } from '@utils/misc';

const screenSizeState = atom<ScreenSize>({
    key: 'ScreenSizeState',
    default: { width: 0, height: 0 },
});

export default screenSizeState;
