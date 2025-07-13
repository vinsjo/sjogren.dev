import { MathUtils, type PerspectiveCamera, type Vector2Like } from 'three';
import type { BlobRenderProps } from '../types';
import { equalV3, getVisibleSizeAtZ, v3 } from '@/utils/three';

export const fitBlobsInView = (
  blobProps: BlobRenderProps[],
  camera: Pick<PerspectiveCamera, 'aspect' | 'fov' | 'position'>,
): BlobRenderProps[] => {
  if (!blobProps.length) return blobProps;

  const aspect = MathUtils.clamp(camera.aspect, 0.5, 1.2);
  const maxCover = 0.9;
  const center = v3(0, 0, 0);

  return blobProps.map((blob) => {
    let s = blob.scale;
    let p = blob.position;
    // eslint-disable-next-line prefer-const
    let { x, y, z } = p;

    const { width: visibleWidth, height: visibleHeight } = getVisibleSizeAtZ(
      z,
      camera,
    );

    const maxRadius = Math.max(s.x, s.y, s.z);

    const radiusLimit: Vector2Like = {
      x: (visibleWidth * maxCover) / 2,
      y: (visibleHeight * maxCover) / 2,
    };

    if (radiusLimit.x - maxRadius < 0) {
      x = 0;
    } else if (x) {
      x = MathUtils.clamp(
        x * aspect,
        -radiusLimit.x + maxRadius,
        radiusLimit.x - maxRadius,
      );
    }

    if (radiusLimit.y - maxRadius < 0) {
      y = 0;
    } else if (y) {
      y = MathUtils.clamp(
        y / aspect,
        -radiusLimit.y + maxRadius,
        radiusLimit.y - maxRadius,
      );
    }

    const minLimit = Math.min(radiusLimit.x, radiusLimit.y);

    let hasChanged = false;

    if (minLimit - maxRadius < 0 && (!x || !y)) {
      s = s.clone().clamp(equalV3(0), equalV3(minLimit));
      hasChanged = true;
    }

    if (x !== p.x || y !== p.y) {
      p = v3(x, y, z).lerp(center, 0.1);
      hasChanged = true;
    }

    if (hasChanged) {
      return {
        ...blob,
        position: p,
        scale: s,
      };
    }

    return blob;
  });
};
