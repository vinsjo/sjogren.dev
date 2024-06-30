export type WH = Record<'width' | 'height', number>;

export function wh(width = 0, height = 0): WH {
  return {
    width: width || 0,
    height: height || 0,
  };
}
