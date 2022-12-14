import { useRecoilValue } from 'recoil';

import {
    orientationState,
    screenSizeState,
    windowSizeState,
    isMobileState,
    screenOrientationState,
} from 'recoilStores';

export const useOrientation = () => useRecoilValue(orientationState);
export const useScreenSize = () => useRecoilValue(screenSizeState);
export const useScreenOrientation = () =>
    useRecoilValue(screenOrientationState);
export const useWindowSize = () => useRecoilValue(windowSizeState);
export const useIsMobile = () => useRecoilValue(isMobileState);

export { default as useIsRotating } from './useIsRotating';
