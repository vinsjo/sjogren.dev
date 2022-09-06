import { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { isFn } from 'x-is-type';
import useDidMount from './useDidMount';

const useWindowSize = (onResize) => {
	const didMount = useDidMount();
	const getWindowSize = useCallback(() => {
		return !didMount || !window
			? {}
			: { width: window.innerWidth, height: window.innerHeight };
	}, [didMount]);

	const [size, setSize] = useState(getWindowSize);

	useLayoutEffect(() => {
		const portrait = window.matchMedia('(orientation: portait)');
		const onResize = () => setSize(getWindowSize());
		window.addEventListener('resize', onResize);
		portrait.addEventListener('change', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
			portrait.removeEventListener('change', onResize);
		};
	}, [getWindowSize]);

	useEffect(() => {
		if (!isFn(onResize)) return;
		onResize(size);
	}, [size, onResize]);

	return size;
};

export default useWindowSize;
