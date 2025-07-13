import { MathUtils, type PerspectiveCamera } from 'three';
import { randomV3, v3, getVisibleSizeAtZ } from '@/utils/three';

import { getAverage, randomNegativeNumber } from '@/utils/math';
import type { BlobRenderProps } from '../types';
import type { MinMax } from '@/types';
import { randomUUID } from '@/utils/misc';

export const getInitialBlobProps = (
  cols: number,
  rows: number,
  camera: Pick<PerspectiveCamera, 'aspect' | 'fov' | 'position'>,
): BlobRenderProps[] => {
  if (cols <= 0 || rows <= 0) {
    return [];
  }
  const { width: maxVisibleWidth, height: maxVisibleHeight } =
    getVisibleSizeAtZ(0, camera);

  const maxRadius =
    Math.min(maxVisibleWidth / cols, maxVisibleHeight / rows) / 2;

  const radiusLimits: MinMax = [maxRadius * 0.75, maxRadius * 1.25];

  const averageRadius = getAverage(radiusLimits);
  /**
   * Max offset from center based on average radius and number of columns and rows
   * to avoid blobs being too close to the edges of the view.
   */
  const maxCenterOffset = {
    x: (averageRadius * cols) / 2,
    y: (averageRadius * rows) / 2,
  };

  const maxPositionOffset = averageRadius / 2;

  const center = v3(0, 0, 0);

  const output: BlobRenderProps[] = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const y =
      MathUtils.mapLinear(
        rowIndex,
        0,
        rows - 1,
        -maxCenterOffset.y,
        maxCenterOffset.y,
      ) || 0;

    for (let colIndex = 0; colIndex < cols; colIndex++) {
      const x =
        MathUtils.mapLinear(
          colIndex,
          0,
          cols - 1,
          -maxCenterOffset.x,
          maxCenterOffset.x,
        ) || 0;

      output.push({
        id: randomUUID(),
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
