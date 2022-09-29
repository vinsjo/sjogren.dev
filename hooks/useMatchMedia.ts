import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { isFn } from 'x-is-type/callbacks';

export type MatchMediaOutputCallback<T = unknown> = (matches: boolean) => T;

const useMatchMedia = <T = unknown>(
	mediaQuery: string,
	initialState = false,
	outputCallback?: MatchMediaOutputCallback<T>
) => {
	const callback = useRef<undefined | MatchMediaOutputCallback<T>>(
		outputCallback
	);
	const [matches, setMatches] = useState(initialState);

	const handler = useCallback((ev: MediaQueryListEvent) => {
		setMatches(ev.matches);
	}, []);

	const output = useMemo(() => {
		return (
			isFn(callback.current) ? callback.current(matches) : matches
		) as typeof callback.current extends MatchMediaOutputCallback<T>
			? T
			: boolean;
	}, [matches, callback]);

	useEffect(() => {
		if (!window) return;
		const media = window.matchMedia(mediaQuery);
		setMatches(media.matches);
		media.addEventListener('change', handler);
		return () => media.removeEventListener('change', handler);
	}, [mediaQuery, handler]);

	return output;
};
export default useMatchMedia;
