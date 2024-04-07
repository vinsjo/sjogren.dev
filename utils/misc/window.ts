import { isNum, isObj } from 'x-is-type';

import { pick } from './object';
import { WH, wh } from './wh';

const isSsr = typeof window === 'undefined';

export function getWindow(): Partial<typeof window> {
  return isSsr ? {} : window;
}

const windowSizeKeys = [
  'innerHeight',
  'innerWidth',
  'outerHeight',
  'outerWidth',
] satisfies Array<keyof typeof window>;

export type WindowSizeKey = (typeof windowSizeKeys)[number];

export type WindowSize = {
  [K in (typeof windowSizeKeys)[number]]: (typeof window)[K];
};

const fallbackWindowSize = Object.fromEntries(
  windowSizeKeys.map((key) => [key, 0])
) as WindowSize;

export function getWindowSize(): WindowSize {
  if (isSsr) return fallbackWindowSize;

  return pick(window, ...windowSizeKeys);
}

export function isWindowSize(size: unknown): size is WindowSize {
  return isObj(size) && windowSizeKeys.every((key) => isNum(size[key]));
}

export function getScreenSize(): WH {
  const { width, height } = getWindow().screen || {};

  return wh(width || 0, height || 0);
}

export function getScreenOrientation(): OrientationType | null {
  return getWindow().screen?.orientation?.type ?? null;
}
