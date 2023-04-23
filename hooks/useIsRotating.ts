import { useEffect, useState, useMemo } from 'react';
import usePrev from '@hooks/usePrev';
import useDebouncedEffect from '@hooks/useDebouncedEffect';
import {
    useWindowSizeStore,
    selectors as windowSizeSelectors,
} from 'stores/windowSizeStore';
import {
    useOrientationStore,
    selectors as orientationSelectors,
} from 'stores/orientationStore';

export const useIsRotating = (rotationDuration = 500): boolean => {
    const [isRotating, setIsRotating] = useState(false);

    const windowSize = useWindowSizeStore(windowSizeSelectors.windowSize);
    const orientation = useOrientationStore(orientationSelectors.orientation);

    const prevWindowSize = usePrev(windowSize);
    const prevOrientation = usePrev(orientation);

    const windowSizeDiff = useMemo(() => {
        if (!prevWindowSize) return 0;
        const { innerWidth: pW, innerHeight: pH } = prevWindowSize;
        const { innerWidth: cW, innerHeight: cH } = windowSize;
        const minDiff = Math.max(cW, cH) * 0.2;
        const diff = Math.max(Math.abs(pW - cW), Math.abs(pH - cH));
        if (diff < minDiff) return 0;
        return diff;
    }, [windowSize, prevWindowSize]);

    useEffect(() => {
        if (!windowSizeDiff || prevOrientation === orientation) return;
        setIsRotating(true);
    }, [orientation, prevOrientation, windowSizeDiff]);

    useDebouncedEffect(
        () => {
            if (!isRotating) return;
            setIsRotating(false);
        },
        rotationDuration,
        [isRotating]
    );

    return isRotating;
};

export default useIsRotating;
