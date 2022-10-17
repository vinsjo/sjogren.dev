import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import {
    windowSizeState,
    screenSizeState,
    orientationState,
    screenOrientationState,
    deviceTypeState,
    currentPathState,
} from 'recoilStores';
// import windowSizeState from '@recoil/windowSize';
// import screenSizeState from '@recoil/screenSize';
// import orientationState from '@recoil/orientation';
// import screenOrientationState from '@recoil/screenOrientation';
// import deviceTypeState from '@recoil/deviceType';
import {
    getWindowSize,
    getScreenOrientation,
    getScreenSize,
    getDeviceType,
} from '@utils/misc';
import useMatchMedia from '@hooks/useMatchMedia';
import useDidMount from '@hooks/useDidMount';

const useCurrentPathEffect = () => {
    const setCurrentPath = useSetRecoilState(currentPathState);
    const { asPath } = useRouter();
    useEffect(() => setCurrentPath(asPath), [asPath, setCurrentPath]);
};

const useWindowSizeEffect = (didMount?: boolean) => {
    const setWindowSize = useSetRecoilState(windowSizeState);
    useEffect(() => {
        if (didMount === false) return;
        const updateWindowSize = () => setWindowSize(getWindowSize());
        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);
        return () => window.removeEventListener('resize', updateWindowSize);
    }, [didMount, setWindowSize]);
};

const useScreenSizeEffect = (didMount?: boolean) => {
    const setScreenSize = useSetRecoilState(screenSizeState);
    useEffect(() => {
        if (didMount === false) return;
        setScreenSize(getScreenSize());
    }, [didMount, setScreenSize]);
};

const useOrientationEffect = (didMount?: boolean) => {
    const [orientation, setOrientation] = useRecoilState(orientationState);
    const setScreenOrientation = useSetRecoilState(screenOrientationState);
    const portrait = useMatchMedia(
        '(orientation:portrait)',
        orientation === 'portrait'
    );
    useEffect(() => {
        if (didMount === false) return;
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
    const didMount = useDidMount();
    useCurrentPathEffect();
    useDeviceTypeEffect();
    useWindowSizeEffect(didMount);
    useScreenSizeEffect(didMount);
    useOrientationEffect(didMount);

    return null;
};

export default RecoilStoreManager;
