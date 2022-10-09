import { atom } from 'recoil';

const screenOrientationState = atom<OrientationType | 'portrait' | 'landscape'>(
    { key: 'ScreenOrientationState', default: 'portrait' }
);

export default screenOrientationState;
