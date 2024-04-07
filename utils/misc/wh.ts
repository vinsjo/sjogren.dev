import { isNum, isObj } from 'x-is-type';

export type WH = Record<'width' | 'height', number>;

export function wh(width = 0, height = 0): WH {
  return {
    width: width || 0,
    height: height || 0,
  };
}

export function isWH(x: unknown): x is WH;
export function isWH<T extends object>(x: T): x is T & WH;
export function isWH(x: unknown): x is WH {
  return (
    isObj(x) &&
    (['width', 'height'] satisfies Array<keyof WH>).every((key) =>
      isNum(x[key])
    )
  );
}
