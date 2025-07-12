import type { RandomBlobOptionsLimits } from '../types';

export const getDefaultRandomBlobOptionsLimits =
  (): RandomBlobOptionsLimits => {
    return {
      mesh: {
        scale: [0.9, 1.1],
        rotationSpeed: [-0.005, 0.005],
      },
      shader: {
        alpha: [1, 1],
        colorMultiplier: [0.4, 1],
        lightThreshold: [0.05, 0.25],
        frequency: [0.5, 3],
        amplitude: [0.05, 0.3],
        distSpeed: [0.01, 0.2],
      },
    };
  };
