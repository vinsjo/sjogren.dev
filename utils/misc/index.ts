import { isArr, isNum, isObj, isStr } from 'x-is-type';
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

export function objectKeys<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T) {
    if (!isObj(obj)) return [];
    return Object.keys(obj) as K[];
}

export function objectEntries<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T) {
    if (!isObj(obj)) return [];
    return Object.entries(obj) as [K, T[K]][];
}

export function objectValues<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T) {
    if (!isObj(obj)) return [];
    return Object.values(obj) as T[K][];
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

export function isWH(x: unknown): x is WH {
    if (!isObj(x)) return false;
    const { width, height } = x;
    return [width, height].every(isNum);
}

export function cloneArrayRecursive<T extends unknown[]>(arr: T): T {
    if (!isArr(arr)) return arr;
    return [...arr].map((value, i, clone) => {
        if (value === arr) return clone;
        if (isArr(value)) return cloneArrayRecursive(value);
        if (isObj(value)) return cloneObjRecursive(value);
        return value;
    }) as T;
}

export function cloneObjRecursive<
    T extends Record<string | number | symbol, unknown>
>(obj: T): T {
    if (!isObj(obj)) return obj;
    const clone = { ...obj };
    objectEntries(clone).forEach(([key, value]) => {
        if (obj === value) {
            clone[key] === clone;
        } else if (isArr(value)) {
            clone[key] = cloneArrayRecursive(value);
        } else if (isObj(value)) {
            clone[key] = cloneObjRecursive(value);
        }
    });
    return clone;
}

export function pick<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T, ...keys: K[]) {
    return (
        !isObj(obj)
            ? {}
            : keys.reduce((output, key) => {
                  if (!(key in obj)) return output;
                  return { ...output, [key]: obj[key] };
              }, {})
    ) as Pick<T, typeof keys[number]>;
}

export function omit<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T, ...keys: K[]) {
    return (
        !isObj(obj)
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
    return keys.every((key) => key in window);
}

export type WindowSize = {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
};
export function getWindowSize(): WindowSize {
    if (!windowExists()) {
        return {
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
        };
    }
    return pick(
        window,
        'innerWidth',
        'innerHeight',
        'outerWidth',
        'outerHeight'
    );
}
export function isWindowSize(size: unknown): size is WindowSize {
    if (!isObj(size)) return false;
    const { innerWidth, innerHeight, outerWidth, outerHeight } = size;
    return [innerWidth, innerHeight, outerWidth, outerHeight].every(isNum);
}

export type ScreenSize = WH;

export function getScreenSize(): ScreenSize {
    if (!windowExists()) return wh(0, 0);
    const { width, height } = window.screen;
    return wh(width, height);
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

export type FormatURLOptions = Record<
    'protocol' | 'hostname' | 'pathname' | 'search' | 'www',
    boolean
>;

export function formatURL(
    urlString: string,
    formatOptions?: Partial<FormatURLOptions>
) {
    if (!isStr(urlString)) return null;
    try {
        const url = new URL(urlString);
        const options: FormatURLOptions = {
            protocol: false,
            www: false,
            hostname: true,
            pathname: true,
            search: true,
        };
        if (isObj(formatOptions)) {
            objectKeys(options).forEach((key) => {
                if (!(key in formatOptions)) return;
                options[key] = formatOptions[key];
            });
        }
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
