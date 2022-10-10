import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
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
import useMatchMedia from '@hooks/useMatchMedia';
import { compareState } from '@utils/react';
import useDidMount from '@hooks/useDidMount';

const RecoilStoreManager = () => {
    const didMount = useDidMount();
    const setWindowSize = useSetRecoilState(windowSizeState);
    useEffect(() => {
        if (!didMount) return;
        const updateWindowSize = () => {
            setWindowSize((prev) => compareState(prev, getWindowSize()));
        };
        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);
        return () => window.removeEventListener('resize', updateWindowSize);
    }, [didMount, setWindowSize]);

    const setScreenSize = useSetRecoilState(screenSizeState);
    useEffect(() => {
        if (!didMount) return;
        setScreenSize(getScreenSize());
    }, [didMount, setScreenSize]);

    const [orientation, setOrientation] = useRecoilState(orientationState);
    const portrait = useMatchMedia(
        '(orientation:portrait)',
        orientation === 'portrait'
    );
    useEffect(() => {
        if (!didMount) return;
        setOrientation(portrait ? 'portrait' : 'landscape');
    }, [didMount, portrait, setOrientation]);

    const setScreenOrientation = useSetRecoilState(screenOrientationState);
    useEffect(() => {
        if (!didMount) return;
        setScreenOrientation(getScreenOrientation() || orientation);
    }, [didMount, orientation, setScreenOrientation]);

    const setDeviceType = useSetRecoilState(deviceTypeState);
    useEffect(() => {
        if (!didMount) return;
        setDeviceType(getDeviceType());
    }, [didMount, setDeviceType]);
    return null;
};

export default RecoilStoreManager;
