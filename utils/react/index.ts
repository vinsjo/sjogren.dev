import { isDeepEqual } from 'x-is-equal';

export function resolveElementRef<T extends Element>(
  ref: Maybe<React.RefObject<T> | T>
): T | null {
  return !ref ? null : 'current' in ref ? ref.current : ref;
}

/**
 * @param prev Previous state
 * @param next Next state
 * @returns  returns prev if prev and next are equal or they are arrays/objects containing equal values
 */
export function getUpdatedState<T = unknown>(prev: T, next: T) {
  return isDeepEqual(prev, next) ? prev : next;
}
