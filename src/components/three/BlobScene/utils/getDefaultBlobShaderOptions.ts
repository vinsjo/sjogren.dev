import { v3 } from '@/utils/three';
import type { BlobShaderOptions } from '../types';

export const getDefaultBlobShaderOptions = (): BlobShaderOptions => {
  return {
    alpha: 1,
    lightThreshold: v3(0.2, 0.2, 0.2),
    frequency: v3(5, 5, 5),
    amplitude: v3(0.2, 0.2, 0.2),
    distSpeed: v3(0.05, 0.05, 0.05),
    colorMultiplier: v3(1.0, 1.0, 1.0),
  };
};
