import { useCallback } from 'react';
import useMatchMedia from './useMatchMedia';

const useOrientation = (initialState?: 'landscape' | 'portrait') => {
    return useMatchMedia(
        '(orientation: portrait)',
        initialState === 'portrait',
        useCallback((matches) => (matches ? 'portrait' : 'landscape'), [])
    );
};

export default useOrientation;
