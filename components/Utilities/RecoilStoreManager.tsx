import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import windowSizeState from '@recoil/windowSize';
import screenSizeState from '@recoil/screenSize';
import orientationState from '@recoil/orientation';
import screenOrientationState from '@recoil/screenOrientation';
import deviceTypeState from '@recoil/deviceType';
import {
    getWindowSize,
    getScreenOrientation,
    getScreenSize,
    getDeviceType,
} from '@utils/misc';
import { compareState } from '@utils/react';
import useMatchMedia from '@hooks/useMatchMedia';

const useWindowSizeEffect = () => {
    const setWindowSize = useSetRecoilState(windowSizeState);
    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize((prev) => compareState(prev, getWindowSize()));
        };
        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);
        return () => window.removeEventListener('resize', updateWindowSize);
    }, [setWindowSize]);
};

const useScreenSizeEffect = () => {
    const setScreenSize = useSetRecoilState(screenSizeState);
    useEffect(
        () => setScreenSize((prev) => compareState(prev, getScreenSize())),
        [setScreenSize]
    );
};

const useOrientationEffect = () => {
    const [orientation, setOrientation] = useRecoilState(orientationState);
    const portrait = useMatchMedia(
        '(orientation:portrait)',
        orientation === 'portrait'
    );
    useEffect(
        () => setOrientation(portrait ? 'portrait' : 'landscape'),
        [portrait, setOrientation]
    );
};

const useScreenOrientationEffect = () => {
    const orientation = useRecoilValue(orientationState);
    const setScreenOrientation = useSetRecoilState(screenOrientationState);
    useEffect(
        () => setScreenOrientation(getScreenOrientation() || orientation),
        [orientation, setScreenOrientation]
    );
};

const useDeviceTypeEffect = () => {
    const setDeviceType = useSetRecoilState(deviceTypeState);
    useEffect(() => setDeviceType(getDeviceType()), [setDeviceType]);
};

const RecoilStoreManager = () => {
    useWindowSizeEffect();
    useScreenSizeEffect();
    useOrientationEffect();
    useScreenOrientationEffect();
    useDeviceTypeEffect();
    return null;
};

export default RecoilStoreManager;
