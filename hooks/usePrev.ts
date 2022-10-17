import { useRef, useEffect } from 'react';

const usePrev = <T = unknown>(current?: T): T | undefined => {
    const output = useRef<T>();
    useEffect(() => {
        if (output.current === current) return;
        output.current = current;
    }, [current]);
    return output.current;
};

export default usePrev;
