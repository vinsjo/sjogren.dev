export const isEqualArrays = (a: unknown[], b: unknown[]): boolean => {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
};

export const hasEqualProps = <T extends object>(
  a: T,
  b: T,
  keys: readonly (keyof T)[],
): boolean => {
  return a === b || keys.every((key) => Object.is(a[key], b[key]));
};
