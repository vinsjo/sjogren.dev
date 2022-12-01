import { useState, useEffect, useCallback } from 'react';
import { isArr } from 'x-is-type';
import { ResizeObserver as ObserverPolyfill } from '@juggle/resize-observer';
import useMatchMedia from './useMatchMedia';
import useElement from './useElement';
import { compareState } from '@utils/react';

const ResizeObserver =
    typeof window === 'undefined' || !('ResizeObserver' in window)
        ? ObserverPolyfill
        : window['ResizeObserver'];

/**
 * Inspired by / based on: https://github.com/jaredLunde/react-hook/blob/master/packages/resize-observer/src/index.tsx
 */
const useResizeObserver = <T extends HTMLElement>(
    target?: React.RefObject<T> | T
) => {
    const element = useElement(target);
    const portrait = useMatchMedia('(orientation: portrait)');

    const [size, setSize] = useState(() => {
        if (!element) return { width: 0, height: 0 };
        const { width, height } = element.getBoundingClientRect();
        return { width, height };
    });

    const updateSize = useCallback((width: number, height: number) => {
        setSize((prev) => compareState(prev, { width, height }));
    }, []);

    useEffect(() => {
        if (!element) return;
        const { width, height } = element.getBoundingClientRect();
        updateSize(width, height);
        const observer = new ResizeObserver(([entry]) => {
            if (!entry) return;
            let width: number, height: number;
            const cbs = entry.contentBoxSize;
            const size = (isArr(cbs) ? cbs[0] : cbs) as ResizeObserverSize;
            const { inlineSize, blockSize } = size || {
                inlineSize: entry.contentRect.width,
                blockSize: entry.contentRect.height,
            };
            width = inlineSize;
            height = blockSize;
            updateSize(width, height);
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [element, updateSize, portrait]);

    return size;
};

export default useResizeObserver;
