import { MathUtils, type PerspectiveCamera } from 'three';
import { randomV3, v3, getVisibleSizeAtZ } from '@/utils/three';

import { getAverage, randomNegativeNumber } from '@/utils/math';
import type { RequiredBlobProps } from '../types';
import type { MinMax } from '@/types';

export const getInitialBlobProps = (
  cols: number,
  rows: number,
  camera: Pick<PerspectiveCamera, 'aspect' | 'fov' | 'position'>,
): RequiredBlobProps[] => {
  if (cols <= 0 || rows <= 0) {
    return [];
  }
  const [maxVisibleHeight, maxVisibleWidth] = getVisibleSizeAtZ(0, camera);

  const maxRadius =
    Math.min(maxVisibleWidth / cols, maxVisibleHeight / rows) / 2;

  const radiusLimits: MinMax = [maxRadius * 0.8, maxRadius * 1.2];

  const avgRadius = getAverage(radiusLimits);
  /**
   * Max x and y position based on average radius and number of columns and rows
   * to avoid blobs being too close to the edges of the view.
   */
  const maxPosition = { x: (avgRadius * cols) / 2, y: (avgRadius * rows) / 2 };

  const maxPositionOffset = avgRadius / 2;

  const center = v3(0, 0, 0);

  const output: RequiredBlobProps[] = [];

  for (let row = 0; row < rows; row++) {
    const y =
      MathUtils.mapLinear(row, 0, rows - 1, -maxPosition.y, maxPosition.y) || 0;

    for (let col = 0; col < cols; col++) {
      const x =
        MathUtils.mapLinear(col, 0, cols - 1, -maxPosition.x, maxPosition.x) ||
        0;

      output.push({
        position: v3(
          x + randomNegativeNumber(maxPositionOffset),
          y + randomNegativeNumber(maxPositionOffset),
          randomNegativeNumber(maxPositionOffset),
        ).lerp(center, Math.random() * 0.5),
        scale: randomV3(...radiusLimits),
      });
    }
  }

  return output;
};
