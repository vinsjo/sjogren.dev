import { useState, useEffect, useCallback } from 'react';
import useOrientation from './useOrientation';
import { compareState } from '@utils/react';
import { windowExists, pick } from '@utils/misc';

export type WindowSize = {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
};

const getWindowSize = (): WindowSize => {
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

const useWindowSize = () => {
    const orientation = useOrientation();
    const [size, setSize] = useState(getWindowSize());
    const updateSize = useCallback(
        () => setSize((prev) => compareState(prev, getWindowSize())),
        []
    );
    useEffect(() => {
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [updateSize, orientation]);
    return size;
};

export default useWindowSize;
