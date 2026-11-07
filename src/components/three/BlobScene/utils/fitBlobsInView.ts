import { MathUtils, type PerspectiveCamera, type Vector2Like } from 'three';
import type { BlobRenderProps } from '../types';
import { getVisibleSizeAtZ, v3 } from '@/utils/three';

export const fitBlobsInView = (
  blobProps: BlobRenderProps[],
  camera: Pick<PerspectiveCamera, 'aspect' | 'fov' | 'position'>,
): BlobRenderProps[] => {
  if (!blobProps.length) return blobProps;

  const aspect = MathUtils.clamp(camera.aspect, 0.5, 1.2);
  const maxCover = 0.9;
  const center = v3(0, 0, 0);

  return blobProps.map((blob) => {
    let scale = blob.scale;
    let position = blob.position;
    let { x, y } = blob.position;

    const { width: visibleWidth, height: visibleHeight } = getVisibleSizeAtZ(
      position.z,
      camera,
    );

    const maxRadius = Math.max(scale.x, scale.y, scale.z);

    const radiusLimit: Vector2Like = {
      x: (visibleWidth * maxCover) / 2,
      y: (visibleHeight * maxCover) / 2,
    };

    if (maxRadius > radiusLimit.x) {
      x = 0;
    } else if (x) {
      x = MathUtils.clamp(
        x * aspect,
        -radiusLimit.x + maxRadius,
        radiusLimit.x - maxRadius,
      );
    }

    if (maxRadius > radiusLimit.y) {
      y = 0;
    } else if (y) {
      y = MathUtils.clamp(
        y / aspect,
        -radiusLimit.y + maxRadius,
        radiusLimit.y - maxRadius,
      );
    }

    const minLimit = Math.min(radiusLimit.x, radiusLimit.y);

    if (maxRadius > minLimit && (!x || !y)) {
      scale = scale.clone().clampScalar(0, minLimit);
    }

    if (x !== position.x || y !== position.y) {
      position = v3(x, y, position.z).lerp(center, 0.1);
    }

    if (scale === blob.scale && position === blob.position) {
      return blob;
    }

    return {
      ...blob,
      position: position,
      scale: scale,
    };
  });
};
