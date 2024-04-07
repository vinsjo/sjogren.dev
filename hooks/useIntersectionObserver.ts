import { useState, useEffect } from 'react';
import { resolveElementRef } from '@/utils/react';

const resizeObserverSupported =
  typeof window !== 'undefined' && 'ResizeObserver' in window;

/**
 * based on / inspired by:
 * https://usehooks-ts.com/react-hook/use-intersection-observer
 */
const useIntersectionObserver = <T extends HTMLElement>(
  target?: React.RefObject<T> | T,
  observerOptions: IntersectionObserverInit = {},
  freezeOnceVisible = false
) => {
  const { root, threshold, rootMargin } = observerOptions;

  const element = resolveElementRef(target);

  const [isIntersecting, setIsIntersecting] = useState(
    !resizeObserverSupported
  );

  const isVisible: boolean = !resizeObserverSupported || isIntersecting;

  const shouldExecute: boolean =
    resizeObserverSupported &&
    element != null &&
    (!freezeOnceVisible || !isVisible);

  useEffect(() => {
    if (!shouldExecute || !element) return;

    const options: IntersectionObserverInit = {
      threshold: threshold ?? 0,
      root: root ?? null,
      rootMargin: rootMargin ?? '0%',
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, shouldExecute, root, threshold, rootMargin]);

  return isVisible;
};

export default useIntersectionObserver;
