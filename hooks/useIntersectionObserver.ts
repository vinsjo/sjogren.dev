import { useState, useEffect, useMemo, useCallback } from 'react';
import { compareState } from '@utils/react';
import useElement from './useElement';
import useDidMount from './useDidMount';
import { windowExists } from '@utils/misc';
import { useIsomorphicLayoutEffect, useUpdateEffect } from 'usehooks-ts';

const defaultOptions: IntersectionObserverInit = {
    threshold: 0,
    root: null,
    rootMargin: '0%',
};

/**
 * based on / inspired by:
 * https://usehooks-ts.com/react-hook/use-intersection-observer
 */
const useIntersectionObserver = <T extends HTMLElement>(
    target?: React.RefObject<T> | T,
    observerOptions?: IntersectionObserverInit,
    freezeOnceVisible = false
) => {
    const didMount = useDidMount();

    const [options, setOptions] = useState<IntersectionObserverInit>(
        observerOptions || defaultOptions
    );
    const element = useElement(target);
    const [entry, setEntry] = useState<IntersectionObserverEntry>();
    const [isSupported, setIsSupported] = useState(true);
    const [shouldExecute, setShouldExecute] = useState(true);

    const updateEntry = useCallback(([entry]: IntersectionObserverEntry[]) => {
        if (!entry) return;
        setEntry(entry);
    }, []);

    const isVisible = useMemo(() => {
        if (!isSupported) return true;
        return !!entry && entry.isIntersecting;
    }, [entry, isSupported]);

    useEffect(() => {
        if (!(observerOptions instanceof Object)) return;
        setOptions((prev) => compareState(prev, observerOptions));
    }, [observerOptions]);

    useEffect(() => {
        if (!shouldExecute) return;
        const observer = new IntersectionObserver(updateEntry, options);
        observer.observe(element);
        return () => observer.disconnect();
    }, [options, element, updateEntry, shouldExecute]);

    useIsomorphicLayoutEffect(() => {
        setIsSupported(windowExists() && 'ResizeObserver' in window);
    }, [didMount]);

    useUpdateEffect(() => {
        setShouldExecute(
            isSupported && element && (!isVisible || !freezeOnceVisible)
        );
    }, [isSupported, element, isVisible, freezeOnceVisible]);

    return useMemo(() => ({ isVisible, entry }), [isVisible, entry]);
};

export default useIntersectionObserver;
