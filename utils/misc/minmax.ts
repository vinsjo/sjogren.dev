import { isNum, isObj } from 'x-is-type';

export type MinMax = Record<'min' | 'max', number>;

export function minmax(min = 0, max = 0): MinMax {
  if (min > max || Number.isNaN(min)) {
    min = Math.min(min || 0, max);
  }
  if (max < min || Number.isNaN(max)) {
    max = Math.max(min, max || 0);
  }
  return {
    min,
    max,
  };
}

export function isMinMax(x: unknown): x is MinMax;
export function isMinMax<T extends object>(x: T): x is T & MinMax;
export function isMinMax(x: unknown): x is MinMax {
  return (
    isObj(x) &&
    (['min', 'max'] satisfies Array<keyof MinMax>).every((key) => isNum(x[key]))
  );
}
