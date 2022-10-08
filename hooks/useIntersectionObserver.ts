import { useState, useEffect, useMemo, useCallback } from 'react';
import { compareState } from '@utils/react';
import useElement from './useElement';
import useDidMount from './useDidMount';
import { windowExists } from '@utils/misc';

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
    const isSupported = useMemo(() => {
        return didMount && windowExists() && 'ResizeObserver' in window;
    }, [didMount]);

    const [options, setOptions] = useState<IntersectionObserverInit>(
        observerOptions || defaultOptions
    );
    const element = useElement(target);
    const [entry, setEntry] = useState<IntersectionObserverEntry>();

    const updateEntry = useCallback(([entry]: IntersectionObserverEntry[]) => {
        if (!entry) return;
        setEntry(entry);
    }, []);

    const isVisible = useMemo(() => {
        if (!isSupported) return true;
        return !!entry && entry.isIntersecting;
    }, [entry, isSupported]);

    const execute = useMemo(() => {
        return isSupported && element && !(isVisible && freezeOnceVisible);
    }, [isSupported, element, isVisible, freezeOnceVisible]);

    useEffect(() => {
        if (!(observerOptions instanceof Object)) return;
        setOptions((prev) => compareState(prev, observerOptions));
    }, [observerOptions]);

    useEffect(() => {
        if (!execute) return;
        const observer = new IntersectionObserver(updateEntry, options);
        observer.observe(element);
        return () => observer.disconnect();
    }, [options, element, updateEntry, execute]);

    return useMemo(() => {
        return { entry, isVisible };
    }, [isVisible, entry]);
};

export default useIntersectionObserver;
