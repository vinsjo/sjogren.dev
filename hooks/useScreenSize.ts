import { useState, useEffect } from 'react';
import useMatchMedia from './useMatchMedia';
import { objStateSetter } from '@utils/misc';

const getWindowSize = () => {
    return typeof window === 'undefined'
        ? { width: 0, height: 0 }
        : { width: window.screen.width, height: window.screen.height };
};

const useScreenSize = () => {
    const portrait = useMatchMedia('(orientation: portait)');
    const [size, setSize] = useState(getWindowSize());
    useEffect(() => {
        setSize((prev) => objStateSetter(prev, getWindowSize()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [portrait]);

    return size;
};

export default useScreenSize;
