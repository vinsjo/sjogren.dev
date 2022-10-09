import { useRef, useEffect } from 'react';

const usePrev = <T = unknown>(current?: T) => {
    const output = useRef(current);
    useEffect(() => {
        if (output.current === current) return;
        output.current = current;
    }, [current]);
    return output.current;
};

export default usePrev;
