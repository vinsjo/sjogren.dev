import { isDeepEqual } from 'x-is-equal';
import { isNum, isObj, isStr } from 'x-is-type';

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

export function classNames(
  ...names: Array<string | boolean | null | undefined | Record<string, unknown>>
) {
  const output = new Set<string>();
  names.forEach((value) => {
    if (!value) return;

    if (isStr(value)) return output.add(value);
    if (isNum(value)) return output.add(String(value));

    if (isObj(value)) {
      Object.keys(value).forEach((key) => key && value[key] && output.add(key));
    }
  });
  return [...output].join(' ');
}
