import { selector } from 'recoil';
import screenSizeState from '@recoil/screenSize';

const screenOrientationState = selector({
    key: 'ScreenOrientationState',
    get: ({ get }) => {
        const { width, height } = get(screenSizeState);
        return width >= height ? 'landscape' : 'portrait';
    },
});

export default screenOrientationState;
