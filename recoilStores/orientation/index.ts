import { atom } from 'recoil';

const orientationState = atom<'landscape' | 'portrait'>({
    key: 'OrientationState',
    default: 'landscape',
});

export default orientationState;
