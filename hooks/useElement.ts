import { useMemo } from 'react';
import useDidMount from './useDidMount';

const useElement = <T extends HTMLElement>(target?: React.RefObject<T> | T) => {
    const didMount = useDidMount();
    return useMemo(() => {
        if (!didMount) return null;
        const el = target && 'current' in target ? target.current : target;
        return !(el instanceof HTMLElement) ? null : el;
    }, [didMount, target]) as T extends HTMLElement ? T : null;
};

export default useElement;
