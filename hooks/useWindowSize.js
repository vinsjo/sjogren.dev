import { useState, useLayoutEffect, useEffect } from 'react';
import { isFn } from 'x-is-type';

const useWindowSize = (onResize) => {
	const [size, setSize] = useState({});

	useLayoutEffect(() => {
		const portrait = window.matchMedia('(orientation: portait)');
		const onResize = () =>
			setSize({
				inner: { width: window.innerWidth, height: window.innerHeight },
				outer: { width: window.outerWidth, height: window.outerHeight },
				avail: { width: screen.availWidth, height: screen.availHeight },
			});
		window.addEventListener('resize', onResize);
		portrait.addEventListener('change', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
			portrait.removeEventListener('change', onResize);
		};
	}, []);

	useEffect(() => {
		if (!isFn(onResize)) return;
		onResize(size);
	}, [size, onResize]);

	return size;
};

export default useWindowSize;
