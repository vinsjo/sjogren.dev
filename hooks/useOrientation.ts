import { useCallback, useRef } from 'react';
import useMatchMedia from './useMatchMedia';

export type ScreenOrientation = 'landscape' | 'portrait';

const useOrientation = (
    initialState?: ScreenOrientation
): ScreenOrientation => {
    const initialValue = useRef(initialState || 'landscape');
    const orientation = useMatchMedia(
        '(orientation: portrait)',
        initialValue.current === 'portrait',
        useCallback((matches) => (matches ? 'portrait' : 'landscape'), [])
    );
    return orientation;
};

export default useOrientation;
