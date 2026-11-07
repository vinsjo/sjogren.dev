import { randomV3 } from '@/utils/three';
import type { BlobOptions } from '../types';

export const getRandomBlobOptions = (): BlobOptions => ({
  shader: {
    colorMultiplier: randomV3(0.5, 1),
    lightThreshold: randomV3(0.1, 0.3),
    frequency: randomV3(0.5, 5),
    amplitude: randomV3(0.05, 0.3),
    distSpeed: randomV3(0.03, 0.6),
  },
  mesh: {
    scale: randomV3(0.9, 1.1),
    rotationSpeed: randomV3(-0.15, 0.15),
  },
});
