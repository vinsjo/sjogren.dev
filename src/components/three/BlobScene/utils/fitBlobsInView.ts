import { MathUtils, type PerspectiveCamera } from 'three';
import type { RequiredBlobProps } from '../types';
import { equalV3, getVisibleSizeAtZ, v3 } from '@/utils/three';

export const fitBlobsInView = (
  blobs: RequiredBlobProps[],
  camera: Pick<PerspectiveCamera, 'aspect' | 'fov' | 'position'>,
): RequiredBlobProps[] => {
  const aspect = MathUtils.clamp(camera.aspect, 0.5, 1.2);
  const maxCover = 0.9;
  const center = v3(0, 0, 0);

  return blobs.map((blob) => {
    let s = blob.scale;
    let p = blob.position;
    // eslint-disable-next-line prefer-const
    let { x, y, z } = p;

    const [visibleWidth, visibleHeight] = getVisibleSizeAtZ(z, camera);
    const maxRadius = Math.max(s.x, s.y, s.z);

    const radiusLimit = {
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
        position: p,
        scale: s,
      };
    }

    return blob;
  });
};
