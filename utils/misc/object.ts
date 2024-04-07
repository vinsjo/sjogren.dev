import { isObj } from 'x-is-type';

export function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

export function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>;
}

export function pick<T extends object>(obj: T): Pick<T, never>;
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
