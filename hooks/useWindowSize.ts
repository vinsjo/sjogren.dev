import { WH } from '@utils/misc';
import { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import useDidMount from './useDidMount';

const useWindowSize = (onResize?: (size: WH) => void | undefined) => {
	const didMount = useDidMount();
	const getWindowSize = useCallback(() => {
		return !didMount || !window
			? { width: 0, height: 0 }
			: { width: window.innerWidth, height: window.innerHeight };
	}, [didMount]);

	const [size, setSize] = useState(getWindowSize);

	useLayoutEffect(() => {
		if (!didMount) return;
		const portrait = window.matchMedia('(orientation: portait)');
		const onResize = () => setSize(getWindowSize());
		window.addEventListener('resize', onResize);
		portrait.addEventListener('change', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
			portrait.removeEventListener('change', onResize);
		};
	}, [getWindowSize, didMount]);

	useEffect(() => {
		if (typeof onResize !== 'function') return;
		onResize(size);
	}, [size, onResize]);

	return size;
};

export default useWindowSize;
