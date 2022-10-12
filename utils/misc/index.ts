import { isArr, isNum, isObj, isStr } from 'x-is-type/callbacks';
import UAParser from 'ua-parser-js';

export function rand(max = 1, min = 0) {
    return Math.random() * (max - min) + min;
}
export function rand_int(max = 10, min = 0) {
    return Math.floor(rand(max, min));
}
export function rand_neg(max = 1) {
    return rand(max, -max);
}

export function shuffle_arr<T>(arr: T[]): T[] {
    if (!isArr(arr)) return arr;
    for (let i = arr.length - 1; i > 0; i--) {
        const randomIndex = rand_int(i + 1);
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
    return arr;
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
    condition: any | ((...values: any[]) => boolean),
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

export function minmax(a?: number, b?: number) {
    if (!isNum(a)) return isNum(b) ? { min: b, max: b } : { min: 0, max: 0 };
    if (!isNum(b)) return { min: a, max: a };
    return {
        min: Math.min(a, b),
        max: Math.max(a, b),
    };
}
export type MinMax = ReturnType<typeof minmax>;

export function isMinMax<T = unknown>(x?: T) {
    return (isObj(x) && isNum(x['min']) && isNum(x['max'])) as T extends {
        min: number;
        max: number;
    }
        ? true
        : false;
}

export function wh(width?: number, height?: number) {
    return {
        width: isNum(width) ? width : 0,
        height: isNum(height) ? height : 0,
    };
}

export type WH = ReturnType<typeof wh>;

export function isWH<T = unknown>(x?: T) {
    return (isObj(x) && isNum(x['width']) && isNum(x['height'])) as T extends {
        width: number;
        height: number;
    }
        ? true
        : false;
}

export function cloneArrayRecursive(arr: any[]) {
    if (!isArr(arr)) return arr;
    const clone = [...arr];
    for (let i = 0; i < clone.length; i++) {
        if (clone[i] === arr) {
            clone[i] = clone;
            continue;
        }
        if (isArr(clone[i])) {
            clone[i] = cloneArrayRecursive(clone[i]);
            continue;
        }
        if (isObj(clone[i])) {
            clone[i] = cloneObjRecursive(clone[i]);
            continue;
        }
    }
    return clone;
}

export function cloneObjRecursive<T extends Object>(obj: T): T {
    if (!(obj instanceof Object)) return obj;
    const clone = { ...obj };
    for (const key of Object.keys(clone)) {
        if (clone[key] === obj) {
            clone[key] === clone;
            continue;
        }
        if (Array.isArray(clone[key])) {
            clone[key] = cloneArrayRecursive(clone[key]);
            continue;
        }
        if (clone[key] instanceof Object) {
            clone[key] = cloneObjRecursive(clone[key]);
            continue;
        }
    }
    return clone;
}

export function pick<
    T extends Record<string | number | symbol, any>,
    K extends keyof T
>(obj: T, ...keys: K[]) {
    return (
        !(obj instanceof Object)
            ? {}
            : keys.reduce((output, key) => {
                  if (!(key in obj)) return output;
                  return { ...output, [key]: obj[key] };
              }, {})
    ) as Pick<T, typeof keys[number]>;
}

export function omit<
    T extends Record<string | number | symbol, any>,
    K extends keyof T
>(obj: T, ...keys: K[]) {
    return (
        !(obj instanceof Object)
            ? {}
            : keys.reduce((output, key) => {
                  if (!(key in obj)) return output;
                  return { ...output, [key]: obj[key] };
              }, {})
    ) as Omit<T, typeof keys[number]>;
}

export function windowExists() {
    return typeof window !== 'undefined';
}

export function windowPropertyExists(...keys: string[]) {
    if (!windowExists()) return false;
    let prev: any = window;
    for (const key of keys) {
        if (!(key in prev)) return false;
        prev = prev[key];
    }
    return true;
}
export type WindowSize = {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
};
export function getWindowSize(): WindowSize {
    return !windowExists()
        ? {
              innerWidth: 0,
              innerHeight: 0,
              outerWidth: 0,
              outerHeight: 0,
          }
        : pick(
              window,
              'innerWidth',
              'innerHeight',
              'outerWidth',
              'outerHeight'
          );
}
export type ScreenSize = {
    width: number;
    height: number;
};
export function getScreenSize(): ScreenSize {
    return !windowExists()
        ? { width: 0, height: 0 }
        : pick(window.screen, 'width', 'height');
}

export function getScreenOrientation(): null | OrientationType {
    if (!windowPropertyExists('screen', 'orientation', 'type')) return null;
    return window.screen.orientation.type;
}
export type DeviceType =
    | null
    | 'console'
    | 'mobile'
    | 'tablet'
    | 'smarttv'
    | 'wearable'
    | 'embedded';
export function getDeviceType(): DeviceType {
    if (!windowExists()) return null;
    const { type } = new UAParser(navigator.userAgent).getDevice();
    return (type || null) as DeviceType;
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

export type FormatURLOptions = Partial<
    Record<'protocol' | 'hostname' | 'pathname' | 'search' | 'www', boolean>
>;

export function formatURL(urlString: string, options?: FormatURLOptions) {
    if (typeof urlString !== 'string') return null;

    try {
        const url = new URL(urlString);
        const defaultOptions: FormatURLOptions = {
            protocol: false,
            www: false,
            hostname: true,
            pathname: true,
            search: true,
        };
        if (!(options instanceof Object)) options = defaultOptions;
        else options = { ...defaultOptions, ...options };
        let output = replaceAtEnd(
            ['protocol', 'hostname', 'pathname', 'search']
                .map((key) => {
                    if (!options[key]) return '';
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
