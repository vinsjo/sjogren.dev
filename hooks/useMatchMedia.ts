import { useState, useEffect, useCallback, useMemo } from 'react';
import { isFn } from 'x-is-type';
function useMatchMedia(mediaQuery: string): boolean;
function useMatchMedia(mediaQuery: string, initialState: boolean): boolean;
function useMatchMedia<T>(
    mediaQuery: string,
    initialState: boolean,
    outputCallback: (matches: boolean) => T
): T;
function useMatchMedia(
    mediaQuery: string,
    initialState = false,
    outputCallback?: <T>(matches: boolean) => T
) {
    const [matches, setMatches] = useState(initialState);

    const handler = useCallback((ev: MediaQueryListEvent) => {
        setMatches(ev.matches);
    }, []);

    useEffect(() => {
        const media = window.matchMedia(mediaQuery);
        setMatches(media.matches);
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, [mediaQuery, handler]);

    return useMemo(() => {
        return isFn(outputCallback) ? outputCallback(matches) : matches;
    }, [matches, outputCallback]) as typeof outputCallback extends (
        matches: boolean
    ) => infer R
        ? R
        : boolean;
}
export default useMatchMedia;
