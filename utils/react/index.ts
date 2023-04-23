import { isDeepEqual } from 'x-is-equal';
import { isObj, isStr } from 'x-is-type';

/**
 * @param prev Previous state
 * @param next Next state
 * @returns  returns prev if prev and next are equal or they are arrays/objects containing equal values
 */
export function compareState<T = unknown>(prev: T, next: T) {
    return isDeepEqual(prev, next) ? prev : next;
}

export function classNames(...names: unknown[]) {
    const output = new Set<string>();
    names.filter(Boolean).forEach((value) => {
        if (isStr(value)) return output.add(value);
        if (isObj(value)) {
            Object.keys(value)
                .filter((key) => value[key])
                .forEach((key) => output.add(key));
        }
    });
    return [...output].join(' ');
}
