import { pick } from './object';

import { type WH, wh } from './wh';

const isSsr = typeof window === 'undefined';

export function getWindow(): Partial<typeof window> {
  return isSsr ? {} : window;
}

export type WindowSize = Pick<
  typeof window,
  `${'inner' | 'outer'}${'Width' | 'Height'}`
>;

const fallbackWindowSize: WindowSize = {
  innerHeight: 0,
  innerWidth: 0,
  outerHeight: 0,
  outerWidth: 0,
};

const windowSizeKeys = Object.keys(fallbackWindowSize) as Array<
  keyof typeof fallbackWindowSize
>;

export function getWindowSize(): WindowSize {
  if (isSsr) return fallbackWindowSize;

  return pick(window, ...windowSizeKeys);
}

export function getScreenSize(): WH {
  const { width, height } = getWindow().screen || {};

  return wh(width || 0, height || 0);
}
