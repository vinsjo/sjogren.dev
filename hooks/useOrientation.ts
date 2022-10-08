import { useCallback, useRef } from 'react';
import useMatchMedia from './useMatchMedia';

type OrientationState = 'landscape' | 'portrait';

const useOrientation = (initialState?: OrientationState) => {
    const orientation = useMatchMedia(
        '(orientation: portrait)',
        initialState === 'portrait',
        useCallback((matches) => (matches ? 'portrait' : 'landscape'), [])
    );
    return orientation;
};

export default useOrientation;
