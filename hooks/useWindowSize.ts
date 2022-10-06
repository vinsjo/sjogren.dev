import { useState, useEffect, useCallback } from 'react';
import useMatchMedia from './useMatchMedia';
import { compareState } from '@utils/react';

const getWindowSize = () => {
    if (typeof window === 'undefined') {
        return {
            innerWidth: 0,
            innerHeight: 0,
        };
    }
    const { innerWidth, innerHeight } = window;
    return {
        innerWidth,
        innerHeight,
    };
};

const useWindowSize = () => {
    const portrait = useMatchMedia('(orientation: portait)');
    const [size, setSize] = useState(getWindowSize);
    const updateSize = useCallback(
        () => setSize((prev) => compareState(prev, getWindowSize())),
        []
    );
    useEffect(() => {
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [updateSize, portrait]);
    return size;
};

export default useWindowSize;
