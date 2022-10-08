import { useState, useEffect } from 'react';
import { compareState } from '@utils/react';
import useOrientation from './useOrientation';
import { pick, windowExists } from '@utils/misc';

const getScreenSize = (): { width: number; height: number } => {
    return !windowExists()
        ? { width: 0, height: 0 }
        : pick(window.screen, 'width', 'height');
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
