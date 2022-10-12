import { useEffect, useState, useMemo, useRef } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import orientationState from '@recoil/orientation';
import screenSizeState from '@recoil/screenSize';
import windowSizeState from '@recoil/windowSize';
import isMobileState from '@recoil/isMobile';
import currentSectionState from '@recoil/currentSection';
import usePrev from '@hooks/usePrev';
import screenOrientationState from '@recoil/screenOrientation';

export const useOrientation = () => useRecoilValue(orientationState);
export const useScreenSize = () => useRecoilValue(screenSizeState);
export const useScreenOrientation = () =>
    useRecoilValue(screenOrientationState);
export const useWindowSize = () => useRecoilValue(windowSizeState);
export const useIsMobile = () => useRecoilValue(isMobileState);

export const useIsRotating = (rotationDuration = 500) => {
    const [isRotating, setIsRotating] = useState(false);

    const windowSize = useWindowSize();
    const orientation = useScreenOrientation();
    const prevWindowSize = usePrev(windowSize);
    const prevOrientation = useRef(orientation);

    const windowSizeDiff = useMemo(() => {
        if (!prevWindowSize) return 0;
        const { innerWidth: pW, innerHeight: pH } = prevWindowSize;
        const { innerWidth: cW, innerHeight: cH } = windowSize;
        const minDiff = Math.max(cW, cH) * 0.2;
        const diff = Math.max(Math.abs(pW - cW), Math.abs(pH - cH));
        if (diff < minDiff) return 0;
        return diff;
    }, [windowSize, prevWindowSize]);
    useEffect(() => {
        if (!windowSizeDiff || prevOrientation.current === orientation) return;
        setIsRotating(true);
        prevOrientation.current = orientation;
    }, [orientation, prevOrientation, windowSizeDiff]);
    useEffect(() => {
        if (!isRotating) return;
        const timeout = setTimeout(() => {
            setIsRotating(false);
        }, rotationDuration);
        return () => clearTimeout(timeout);
    }, [rotationDuration, isRotating, setIsRotating, orientation]);

    return isRotating;
};
