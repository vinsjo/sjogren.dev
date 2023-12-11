import { useEffect, useState } from 'react';
import useDidMount from './useDidMount';

const useElement = <T extends HTMLElement>(
  target?: React.RefObject<T> | T
): T | null => {
  const didMount = useDidMount();
  const [element, setElement] = useState<T | null>(null);
  useEffect(() => {
    if (!didMount) return;
    const el = target && 'current' in target ? target.current : target;
    if (!(el instanceof HTMLElement)) return;
    setElement(el);
  }, [didMount, target]);

  return element;
};

export default useElement;
