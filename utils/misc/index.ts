/* eslint-disable @typescript-eslint/ban-types */
import { isArr, isNum, isObj } from 'x-is-type';
import UAParser from 'ua-parser-js';

import { rand_int } from '@utils/math';

export function shuffle_arr<T>(arr: T[]): T[] {
  if (!arr.length) return arr;
  for (let i = arr.length - 1; i > 0; i--) {
    const randomIndex = rand_int(i + 1);
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}

export function objectKeys<T extends object = Record<string, unknown>>(
  obj: T
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

export function objectEntries<T extends object = Record<string, unknown>>(
  obj: T
) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

export function objectValues<T extends object = Record<string, unknown>>(
  obj: T
) {
  return Object.values(obj) as Array<T[keyof T]>;
}

/**
 * ternary operator function
 * if condition is true or is a function that returns true a is returned otherwise b is returned.
 * if additional parameters are passed (args),
 * they are passed to condition (if condition is a function),
 * otherwise a is passed
 */
export function tern<T1, T2>(
  a: T1,
  b: T2,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any | ((...values: any[]) => boolean),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
): T1 | T2 {
  return (
    typeof condition !== 'function'
      ? condition
      : condition(...(args.length > 0 ? args : [a]))
  )
    ? a
    : b;
}

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

export function cloneArrayRecursive<T extends unknown[]>(arr: T): T {
  if (!isArr(arr)) return arr;
  return [...arr].map((value, _, clone) => {
    if (value === arr) return clone;
    if (isArr(value)) return cloneArrayRecursive(value);
    if (isObj(value)) return cloneObjRecursive(value);
    return value;
  }) as T;
}

export function cloneObjRecursive<T extends object = Record<string, unknown>>(
  obj: T
): T {
  if (!isObj(obj)) return obj;
  const clone = { ...obj } as T;

  objectKeys(clone).forEach((key) => {
    Object.assign(clone, {
      [key]: (() => {
        const value = clone[key];
        if (Object.is(obj, value)) return clone;

        if (!isObj(value)) return value;

        if (isArr(value)) return cloneArrayRecursive(value);

        return cloneObjRecursive(value);
      })(),
    });
  });

  return clone;
}

export function pick<T extends object>(obj: T): {};
export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K>;

export function pick<T extends object, K extends keyof T = never>(
  obj: T,
  ...keys: K[]
) {
  if (!isObj(obj)) return obj;

  return keys.reduce((output, key) => {
    if (key in obj) {
      output[key] = obj[key];
    }
    return output;
  }, {} as Pick<T, K>);
}

export function omit<T extends object>(obj: T): T;
export function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K>;

export function omit<T extends object, K extends keyof T = never>(
  obj: T,
  ...keys: K[]
) {
  if (!isObj(obj) || !keys.length) return obj;

  const isIncludedKey = (key: PropertyKey): key is Exclude<keyof T, K> => {
    return !(keys as unknown[]).includes(key);
  };

  return objectKeys(obj).reduce((output, key) => {
    if (isIncludedKey(key)) {
      output[key] = obj[key];
    }
    return output;
  }, {} as Omit<T, K>);
}

export function windowExists() {
  return typeof window !== 'undefined';
}

export function getWindow(): Partial<typeof window> {
  return !windowExists() ? {} : window;
}

export function windowPropertyExists(...keys: string[]) {
  if (!windowExists()) return false;
  return keys.every((key) => key in window);
}

const windowSizeKeys = [
  'innerHeight',
  'innerWidth',
  'outerHeight',
  'outerWidth',
] satisfies Array<keyof typeof window>;

export type WindowSize = {
  [K in (typeof windowSizeKeys)[number]]: (typeof window)[K];
};

const fallbackWindowSize = Object.fromEntries(
  windowSizeKeys.map((key) => [key, 0])
) as WindowSize;

export function getWindowSize(): WindowSize {
  if (!windowExists()) return fallbackWindowSize;

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

export type DeviceType =
  | 'console'
  | 'mobile'
  | 'tablet'
  | 'smarttv'
  | 'wearable'
  | 'embedded';

export type MobileDeviceType = Extract<DeviceType, 'mobile' | 'tablet'>;

export function getDeviceType(): DeviceType | null {
  const { userAgent } = getWindow()?.navigator ?? {};

  return !userAgent
    ? null
    : (new UAParser(userAgent).getDevice().type as DeviceType) || null;
}

const mobileDeviceTypes = new Set<MobileDeviceType>(['mobile', 'tablet']);

export function isMobileDeviceType(type: unknown): type is MobileDeviceType {
  return (mobileDeviceTypes as Set<unknown>).has(type);
}

export function replaceAtEnd(
  str: string,
  searchValue: string,
  replaceValue = ''
) {
  if (!str.length || !searchValue.length) return str;
  const index = str.length - searchValue.length;
  const slice = str.slice(index);
  if (slice !== searchValue) return str;
  return str.slice(0, index) + replaceValue;
}

export type FormatURLOptions = Record<
  'protocol' | 'hostname' | 'pathname' | 'search' | 'www',
  boolean
>;

export function formatURL(
  urlString?: string,
  formatOptions: Partial<FormatURLOptions> = {}
) {
  if (!urlString) return null;
  try {
    const url = new URL(urlString);
    const options: FormatURLOptions = Object.assign(
      {
        protocol: false,
        www: false,
        hostname: true,
        pathname: true,
        search: true,
      },
      formatOptions
    );

    const output = replaceAtEnd(
      ['protocol', 'hostname', 'pathname', 'search']
        .map((key) => {
          return !options[key] ? '' : url[key];
        })
        .join(''),
      '/',
      ''
    );
    return !options.www ? output.replace('www.', '') : output;
  } catch (e) {
    return null;
  }
}
