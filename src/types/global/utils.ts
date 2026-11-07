export {};

declare global {
  type Nullable<T> = null | T;

  type Maybe<T> = T | null | undefined;

  /**
   * Helper type based on Object.values to get a union type of object values
   *
   * Mainly intended to be used for extracting values from mapped object types
   */
  type ObjectValues<T> =
    T extends ArrayLike<infer R>
      ? R
      : T extends { [Key: PropertyKey]: infer R }
        ? R
        : T extends object
          ? T[keyof T]
          : never;

  type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

  type ExtractStrict<T, U extends T> = Extract<T, U>;
  type ExcludeStrict<T, U extends T> = Exclude<T, U>;
  type OmitStrict<T, K extends keyof T> = Omit<T, K>;

  type ExtractKeysByType<T extends object, U> = keyof {
    [K in keyof T as Extract<T[K], U> extends never ? never : K]: T[K];
  };

  type ExcludeKeysByType<T extends object, U> =
    ExtractKeysByType<T, U> extends never
      ? keyof T
      : Exclude<keyof T, ExtractKeysByType<T, U>>;

  type Prettify<T> = { [K in keyof T]: T[K] } & {};
}
