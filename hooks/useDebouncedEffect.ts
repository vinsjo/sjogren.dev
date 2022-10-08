import { useEffect } from 'react';
import type { EffectCallback, DependencyList } from 'react';

const useDebouncedEffect = (
    effect: EffectCallback,
    delay: number,
    deps?: DependencyList
) => {
    useEffect(() => {
        let cleanup: ReturnType<EffectCallback>;
        const timeout = setTimeout(() => {
            cleanup = effect();
        }, delay);
        return () => {
            clearTimeout(timeout);
            if (typeof cleanup === 'function') cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...(deps || []), delay]);
};

export default useDebouncedEffect;
