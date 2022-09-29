import { useState, useLayoutEffect, useEffect, useCallback } from 'react';

const effect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const useMatchMedia = (mediaQuery: string, initialState = false) => {
	const [matches, setMatches] = useState(initialState);

	const handler = useCallback((ev: MediaQueryListEvent) => {
		setMatches(ev.matches);
	}, []);

	effect(() => {
		const media = window.matchMedia(mediaQuery);
		setMatches(media.matches);
		media.addEventListener('change', handler);
		return () => media.removeEventListener('change', handler);
	}, [mediaQuery, handler]);

	return matches;
};
export default useMatchMedia;
