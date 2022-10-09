import { useState, useEffect } from 'react';
import { compareState } from '@utils/react';
import { getWindowSize } from '@utils/misc';

const useWindowSize = () => {
    const [size, setSize] = useState(getWindowSize());
    useEffect(() => {
        const updateSize = () => {
            setSize((prev) => compareState(prev, getWindowSize()));
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
};

export default useWindowSize;
