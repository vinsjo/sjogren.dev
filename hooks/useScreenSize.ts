import { useState, useEffect } from 'react';
import { objStateSetter } from '@utils/misc';
import useDidMount from './useDidMount';

const getScreenSize = () => {
    return typeof window === 'undefined'
        ? { width: 0, height: 0 }
        : { width: window.screen.width, height: window.screen.height };
};

const useScreenSize = () => {
    const didMount = useDidMount();
    const [size, setSize] = useState(getScreenSize);
    useEffect(() => {
        if (!didMount) return;
        setSize((prev) => objStateSetter(prev, getScreenSize()));
    }, [didMount]);
    return size;
};

export default useScreenSize;
