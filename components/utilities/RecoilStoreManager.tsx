import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
    windowSizeState,
    screenSizeState,
    orientationState,
    screenOrientationState,
    deviceTypeState,
} from 'recoilStores';
import {
    getWindowSize,
    getScreenOrientation,
    getScreenSize,
    getDeviceType,
} from '@utils/misc';
import useMatchMedia from '@hooks/useMatchMedia';
import useDidMount from '@hooks/useDidMount';

const useWindowSizeEffect = () => {
    const setWindowSize = useSetRecoilState(windowSizeState);
    useEffect(() => {
        const updateSize = () => setWindowSize(getWindowSize());
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [setWindowSize]);
};

const useScreenSizeEffect = () => {
    const setScreenSize = useSetRecoilState(screenSizeState);
    useEffect(() => {
        setScreenSize(getScreenSize());
    }, [setScreenSize]);
};

const useOrientationEffect = () => {
    const didMount = useDidMount();
    const [orientation, setOrientation] = useRecoilState(orientationState);
    const setScreenOrientation = useSetRecoilState(screenOrientationState);
    const portrait = useMatchMedia(
        '(orientation:portrait)',
        orientation === 'portrait'
    );
    useEffect(() => {
        if (!didMount) return;
        const orientation = portrait ? 'portrait' : 'landscape';
        const screenOrientation = getScreenOrientation() || orientation;
        setOrientation(orientation);
        setScreenOrientation(screenOrientation);
    }, [didMount, portrait, setOrientation, setScreenOrientation]);
};

const useDeviceTypeEffect = () => {
    const setDeviceType = useSetRecoilState(deviceTypeState);
    useEffect(() => {
        setDeviceType(getDeviceType());
    }, [setDeviceType]);
};

const RecoilStoreManager = () => {
    useDeviceTypeEffect();
    useWindowSizeEffect();
    useScreenSizeEffect();
    useOrientationEffect();

    return null;
};

export default RecoilStoreManager;
