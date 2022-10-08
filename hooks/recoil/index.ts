import { useRecoilValue } from 'recoil';
import orientationState from '@recoil/orientation';
import screenSizeState from '@recoil/screenSize';
import windowSizeState from '@recoil/windowSize';

export const useOrientation = () => useRecoilValue(orientationState);
export const useScreenSize = () => useRecoilValue(screenSizeState);
export const useWindowSize = () => useRecoilValue(windowSizeState);
