import {
	useState,
	useLayoutEffect,
	useEffect,
	useMemo,
	useCallback,
} from 'react';
import { isArr } from 'x-is-type/callbacks';
import { ResizeObserver as ObserverPolyfill } from '@juggle/resize-observer';
import useMatchMedia from './useMatchMedia';
import useDidMount from './useDidMount';
import { isNum } from 'x-is-type';
import { objStateSetter } from '@utils/misc';

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
	const didMount = useDidMount();
	const element = useMemo<T | null>(() => {
		const el = target && 'current' in target ? target.current : target;
		return !(el instanceof HTMLElement) ? null : el;
	}, [target]);

	const portrait = useMatchMedia('(orientation: portrait)');

	const [size, setSize] = useState(() => {
		if (!element) return { width: 0, height: 0 };
		const { width, height } = element.getBoundingClientRect();
		return { width, height };
	});

	const updateSize = useCallback((width: number, height: number) => {
		setSize((prev) => objStateSetter(prev, { width, height }));
	}, []);

	useLayoutEffect(() => {
		if (!element) return;
		const observer = new ResizeObserver(([entry]) => {
			if (!entry) return;
			let width: number, height: number;
			if (!('contentBoxSize' in entry)) {
				width = entry.contentRect.width;
				height = entry.contentRect.height;
			} else {
				const cbs = entry.contentBoxSize;
				const { inlineSize, blockSize } = (
					isArr(cbs) ? cbs[0] : cbs
				) as ResizeObserverSize;
				width = inlineSize;
				height = blockSize;
			}
			updateSize(width, height);
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, [element, updateSize]);

	useEffect(() => {
		if (!element || !didMount) return;
		const { width, height } = element.getBoundingClientRect();
		updateSize(width, height);
	}, [element, portrait, updateSize, didMount]);

	return size;
};

export default useResizeObserver;
