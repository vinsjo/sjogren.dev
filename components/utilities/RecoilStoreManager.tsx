import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import {
    windowSizeState,
    screenSizeState,
    orientationState,
    screenOrientationState,
    deviceTypeState,
    windowScrollState,
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

// const useCurrentPathEffect = () => {
//     const setCurrentPath = useSetRecoilState(currentPathState);
//     const { asPath } = useRouter();
//     useEffect(() => setCurrentPath(asPath), [asPath, setCurrentPath]);
// };

const useWindowScrollEffect = () => {
    const setWindowScroll = useSetRecoilState(windowScrollState);
    useEffect(() => {
        const updateWindowScroll = () => {};
    }, [setWindowScroll]);
};

const useWindowEffects = () => {
    const setWindowScroll = useSetRecoilState(windowScrollState);
    const [windowSize, setWindowSize] = useRecoilState(windowSizeState);
    useEffect(() => {
        const updateSize = () => setWindowSize(getWindowSize());
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [setWindowSize]);
    useEffect(() => {
        const updateScroll = () => {
            const { scrollX, scrollY } = window;
            setWindowScroll({ scrollX, scrollY });
        };
        updateScroll();
        window.addEventListener('scroll', updateScroll);
        return () => window.removeEventListener('scroll', updateScroll);
    }, [setWindowScroll, windowSize]);
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
    // useCurrentPathEffect();
    useDeviceTypeEffect();
    useWindowEffects();
    useScreenSizeEffect();
    useOrientationEffect();

    return null;
};

export default RecoilStoreManager;
