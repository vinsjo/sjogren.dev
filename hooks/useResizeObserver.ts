import { useState, useLayoutEffect, useMemo } from 'react';
import { isArr } from 'x-is-type/callbacks';
import { wh } from '@utils/misc';
import { ResizeObserver as ObserverPolyfill } from '@juggle/resize-observer';

const ResizeObserver =
	!window || !('ResizeObserver' in window)
		? ObserverPolyfill
		: window['ResizeObserver'];
/**
 * Inspired by / based on: https://github.com/jaredLunde/react-hook/blob/master/packages/resize-observer/src/index.tsx
 */
const useResizeObserver = <T extends HTMLElement>(
	target?: React.RefObject<T> | T
) => {
	const element = useMemo<T | null>(() => {
		const el = target && 'current' in target ? target.current : target;
		return !(el instanceof HTMLElement) ? null : el;
	}, [target]);

	const [size, setSize] = useState(() => {
		if (!element) return wh(0, 0);
		const { width, height } = element.getBoundingClientRect();
		return wh(width, height);
	});
	const observer = useMemo(() => {
		return new ResizeObserver(([entry]) => {
			if (!entry) return;
			if ('contentBoxSize' in entry) {
				const cbs = entry.contentBoxSize;
				const { inlineSize, blockSize } = (
					isArr(cbs) ? cbs[0] : cbs
				) as ResizeObserverSize;
				return setSize(wh(inlineSize, blockSize));
			}
			const { width, height } = entry.contentRect;
			setSize(wh(width, height));
		});
	}, [setSize]);

	useLayoutEffect(() => {
		if (!element) return;
		observer.observe(element);
		return () => observer.disconnect();
	}, [element, observer]);

	return size;
};

export default useResizeObserver;
