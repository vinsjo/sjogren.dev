import { useRecoilValue } from 'recoil';
import orientationState from '@recoil/orientation';
import screenSizeState from '@recoil/screenSize';
import windowSizeState from '@recoil/windowSize';
import isMobileState from '@recoil/isMobile';
import screenOrientationState from '@recoil/screenOrientation';

export const useOrientation = () => useRecoilValue(orientationState);
export const useScreenSize = () => useRecoilValue(screenSizeState);
export const useScreenOrientation = () =>
    useRecoilValue(screenOrientationState);
export const useWindowSize = () => useRecoilValue(windowSizeState);
export const useIsMobile = () => useRecoilValue(isMobileState);

export { default as useIsRotating } from './useIsRotating';
