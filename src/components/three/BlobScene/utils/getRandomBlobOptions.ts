import type { Vector3 } from 'three';

import { randomV3 } from '@/utils/three';
import type {
  BlobOptions,
  BlobShaderOptions,
  RandomBlobOptionsLimits,
} from '../types';
import { getDefaultBlobShaderOptions } from './getDefaultBlobShaderOptions';
import { getDefaultRandomBlobOptionsLimits } from './getDefaultRandomBlobOptionsLimits';

export const getRandomBlobOptions = (
  limitOptions: DeepPartial<RandomBlobOptionsLimits> = {},
): BlobOptions => {
  const shader = getDefaultBlobShaderOptions();

  const { mesh: meshLimits, shader: shaderLimits } =
    getDefaultRandomBlobOptionsLimits();

  if (limitOptions.mesh) {
    Object.assign(meshLimits, limitOptions.mesh);
  }

  if (limitOptions.shader) {
    Object.assign(shaderLimits, limitOptions.shader);
  }

  (
    [
      'lightThreshold',
      'frequency',
      'amplitude',
      'distSpeed',
      'colorMultiplier',
    ] satisfies ExtractKeysByType<BlobShaderOptions, Vector3>[]
  ).forEach((key) => {
    shader[key] = randomV3(...shaderLimits[key]);
  });

  return {
    shader,
    mesh: {
      scale: randomV3(...meshLimits.scale),
      rotationSpeed: randomV3(...meshLimits.rotationSpeed),
    },
  };
};
