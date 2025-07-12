import { equalV3 } from '@/utils/three';
import type { BlobShaderOptions } from '../types';

export const getDefaultBlobShaderOptions = (): BlobShaderOptions => {
  return {
    lightThreshold: equalV3(0.2),
    frequency: equalV3(5),
    amplitude: equalV3(0.2),
    distSpeed: equalV3(0.05),
    colorMultiplier: equalV3(1.0),
  };
};
