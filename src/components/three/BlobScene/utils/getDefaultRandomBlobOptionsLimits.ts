import type { RandomBlobOptionsLimits } from '../types';

export const getDefaultRandomBlobOptionsLimits =
  (): RandomBlobOptionsLimits => {
    return {
      mesh: {
        scale: [0.9, 1.1],
        rotationSpeed: [-0.005, 0.005],
      },
      shader: {
        colorMultiplier: [0.5, 1],
        lightThreshold: [0.1, 0.3],
        frequency: [0.5, 5],
        amplitude: [0.05, 0.3],
        distSpeed: [0.01, 0.2],
      },
    };
  };
