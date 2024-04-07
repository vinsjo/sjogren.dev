import { isArr, isObj } from 'x-is-type';
import { objectKeys } from './object';

export function cloneArrayRecursive<T extends unknown[]>(arr: T): T {
  if (!isArr(arr)) return arr;
  return [...arr].map((value, _, clone) => {
    if (value === arr) return clone;
    if (isArr(value)) return cloneArrayRecursive(value);
    if (isObj(value)) return cloneObjRecursive(value);
    return value;
  }) as T;
}

export function cloneObjRecursive<T extends object>(obj: T): T {
  if (!isObj(obj)) return obj;
  const clone = { ...obj } as T;

  objectKeys(clone).forEach((key) => {
    const value = (() => {
      const value = clone[key];
      if (Object.is(obj, value)) return clone;

      if (!isObj(value)) return value;

      if (isArr(value)) return cloneArrayRecursive(value);

      return cloneObjRecursive(value);
    })();

    (clone as Record<typeof key, unknown>)[key] = value;
  });

  return clone;
}
