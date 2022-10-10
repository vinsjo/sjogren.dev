import { isEqual } from 'x-is-equal';

/**
 * @param prev Previous state
 * @param next Next state
 * @returns  returns prev if prev and next are equal or they are arrays/objects containing equal values
 */
export function compareState<T = unknown>(prev: T, next: T) {
    return isEqual(prev, next) ? prev : next;
}
export function classNames(...names: unknown[]) {
    return [
        ...new Set(names.filter((n) => n && typeof n === 'string') as string[]),
    ].join(' ');
}
