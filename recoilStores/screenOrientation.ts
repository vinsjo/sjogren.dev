import { atom } from 'recoil';

export type ScreenOrientation = OrientationType | 'portrait' | 'landscape';

const screenOrientationState = atom<ScreenOrientation>({
    key: 'ScreenOrientationState',
    default: 'portrait',
});

export default screenOrientationState;
