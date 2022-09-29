import { useState, useEffect, useCallback } from 'react';
import useDidMount from './useDidMount';
import useMatchMedia from './useMatchMedia';
import { objStateSetter } from '@utils/misc';

const getWindowSize = () => {
	return !window
		? { width: 0, height: 0 }
		: { width: window.innerWidth, height: window.innerHeight };
};

const useWindowSize = () => {
	const didMount = useDidMount();
	const portrait = useMatchMedia('(orientation: portait)');
	const [size, setSize] = useState(getWindowSize());
	const updateSize = useCallback(() => {
		setSize((prev) => objStateSetter(prev, getWindowSize()));
	}, []);

	useEffect(() => {
		if (!didMount) return;
		updateSize();
		window.addEventListener('resize', updateSize);
		return () => {
			window.removeEventListener('resize', updateSize);
		};
	}, [updateSize, didMount, portrait]);

	return size;
};

export default useWindowSize;
