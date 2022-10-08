import { useState, useEffect } from 'react';
import { compareState } from '@utils/react';
import useOrientation from './useOrientation';

const getScreenSize = () => {
    return typeof window === 'undefined'
        ? { width: 0, height: 0 }
        : { width: window.screen.width, height: window.screen.height };
};

const useScreenSize = () => {
    const orientation = useOrientation();
    const [size, setSize] = useState(getScreenSize);
    useEffect(() => {
        setSize((prev) => compareState(prev, getScreenSize()));
    }, [orientation]);
    return size;
};

export default useScreenSize;
