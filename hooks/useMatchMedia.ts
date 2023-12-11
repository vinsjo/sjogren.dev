import { useState, useEffect, useCallback, useMemo } from 'react';
import { isFn } from 'x-is-type';
function useMatchMedia(mediaQuery: string, initialState?: boolean): boolean;
function useMatchMedia<T = boolean>(
  mediaQuery: string,
  initialState?: boolean,
  outputCallback?: (matches: boolean) => T
): T;
function useMatchMedia<T = boolean>(
  mediaQuery: string,
  initialState = false,
  outputCallback?: (matches: boolean) => T
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
    return !isFn(outputCallback) ? matches : outputCallback(matches);
  }, [matches, outputCallback]);
}
export default useMatchMedia;
