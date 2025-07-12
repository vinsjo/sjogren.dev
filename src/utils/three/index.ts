import { PerspectiveCamera, Vector2, Vector3, type IUniform } from 'three';
import { randomNumber } from '@/utils/math';
import type { MinMax, WH } from '@/types';

/** Create Vector3 */
export const v3 = (...args: ConstructorParameters<typeof Vector3>): Vector3 => {
  return new Vector3(...args);
};

/** Create Vector2 */
export const v2 = (...args: ConstructorParameters<typeof Vector2>): Vector2 => {
  return new Vector2(...args);
};

/** Create Vector3 with equal x, y and z values */
export const equalV3 = (xyz: number) => v3(xyz, xyz, xyz);

export const uValue = <T>(value: T): IUniform<T> => ({ value });

/** Create Vector3 with random x, y and z values, between min and max */
export const randomV3: (...args: MinMax) => Vector3 = (min, max) => {
  return v3(
    randomNumber(max, min),
    randomNumber(max, min),
    randomNumber(max, min),
  );
};

/**
 * Get max visible height and width at z position based on camera's z position,
 * aspect ratio and field of view.
 *
 * Based on: {@link https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269}
 *
 * @param positionZ - z position to calculate visible size at
 * @param camera - camera used to calculate visible size.
 * Only `fov`, `position` and `aspect` are used.
 */
export const getVisibleSizeAtZ = (
  positionZ: number,
  camera: Pick<PerspectiveCamera, 'fov' | 'position' | 'aspect'>,
): WH => {
  if (!camera.fov) return [0, 0];

  const camZ = camera.position.z;
  // compensate for cameras not positioned at z=0
  const depth = positionZ < camZ ? positionZ - camZ : positionZ + camZ;

  // vertical fov in radians
  const verticalFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  const maxVisibleHeight = Math.tan(verticalFOV / 2) * Math.abs(depth);
  const maxVisibleWidth = maxVisibleHeight * camera.aspect;

  return [maxVisibleWidth, maxVisibleHeight];
};
