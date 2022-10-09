import { atom } from 'recoil';

const orientationState = atom<'landscape' | 'portrait'>({
    key: 'OrientationState',
    default: 'portrait',
});

export default orientationState;
