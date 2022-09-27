import React, { useState, useEffect, useMemo } from 'react';

const useResizeObserver = <T extends HTMLElement>(el?: T) => {
	const element = useMemo<T | null>(
		() => (el instanceof HTMLElement ? el : null),
		[el]
	);
	const [size, setSize] = useState(() => {
		if (!element) return { width: 0, height: 0 };
		const { width, height } = element.getBoundingClientRect();
		return { width, height };
	});

	useEffect(() => {
		if (!element) return;
		const observer = new ResizeObserver((entries) => {
			try {
				if (!entries.length) return;
				const [entry] = entries;
				if (!entry) return;
				if (!entry.contentBoxSize) {
					const { width, height } = entry.contentRect;
					return setSize({ width, height });
				}
				const contentBoxSize = Array.isArray(entry.contentBoxSize)
					? entry.contentBoxSize[0]
					: entry.contentBoxSize;
				const { inlineSize, blockSize } = contentBoxSize;
				setSize({ width: inlineSize, height: blockSize });
			} catch (e) {
				console.error(e);
			}
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, [element, setSize]);
	return size;
};

export default useResizeObserver;
