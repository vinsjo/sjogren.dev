declare type Nullable<T> = null | T;

declare type Maybe<T> = T | null | undefined;

/**
 * Helper type based on Object.values to get a union type of object values
 *
 * Mainly intended to be used for extracting values from mapped object types
 */
declare type ObjectValues<T> = T extends ArrayLike<infer R>
  ? R
  : T extends { [Key: PropertyKey]: infer R }
  ? R
  : T extends object
  ? T[keyof T]
  : never;

declare type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
