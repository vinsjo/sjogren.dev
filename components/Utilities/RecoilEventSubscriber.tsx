import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import useDebouncedEffect from '@hooks/useDebouncedEffect';
import windowSizeState, { WindowSizeState } from '@recoil/windowSize';
import screenSizeState, { ScreenSizeState } from '@recoil/screenSize';
import orientationState from '@recoil/orientation';
import { windowExists, pick } from '@utils/misc';
import { compareState } from '@utils/react';

const getWindowSize = (): WindowSizeState => {
    return !windowExists()
        ? {
              innerWidth: 0,
              innerHeight: 0,
              outerWidth: 0,
              outerHeight: 0,
          }
        : pick(
              window,
              'innerWidth',
              'innerHeight',
              'outerWidth',
              'outerHeight'
          );
};

const getScreenSize = (): ScreenSizeState => {
    return !windowExists()
        ? { width: 0, height: 0 }
        : pick(window.screen, 'width', 'height');
};

const RecoilEventSubscriber = () => {
    const setWindowSize = useSetRecoilState(windowSizeState);
    const setScreenSize = useSetRecoilState(screenSizeState);
    const [orientation, setOrientation] = useRecoilState(orientationState);
    const [portrait, setPortrait] = useState(orientation === 'portrait');

    useEffect(() => {
        const media = window.matchMedia('(orientation: portrait)');
        setPortrait(media.matches);
        const onChange = ({ matches }: MediaQueryListEvent) => {
            setPortrait(matches);
        };
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize((prev) => compareState(prev, getWindowSize()));
        };
        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);
        return () => window.removeEventListener('resize', updateWindowSize);
    }, [portrait, setWindowSize]);

    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize((prev) => compareState(prev, getWindowSize()));
        };
        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);
        return () => window.removeEventListener('resize', updateWindowSize);
    }, [portrait, setWindowSize]);

    useEffect(() => {
        setScreenSize((prev) => compareState(prev, getScreenSize()));
    }, [portrait, setScreenSize]);

    useEffect(() => {
        setOrientation(portrait ? 'portrait' : 'landscape');
    }, [portrait, setOrientation]);

    return null;
};

export default RecoilEventSubscriber;
