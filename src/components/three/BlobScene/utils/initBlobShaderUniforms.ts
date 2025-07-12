import { uValue } from '@/utils/three';
import type { BlobShaderOptions, BlobUniforms } from '../types';
import { getDefaultBlobShaderOptions } from './getDefaultBlobShaderOptions';

export const initBlobShaderUniforms = (
  options?: Partial<BlobShaderOptions>,
): BlobUniforms => {
  const {
    alpha,
    lightThreshold,
    frequency,
    amplitude,
    distSpeed,
    colorMultiplier,
  } = Object.assign(getDefaultBlobShaderOptions(), options);

  return {
    uTime: uValue(0.0),
    uAlpha: uValue(alpha),
    uLightThreshold: uValue(lightThreshold),
    uFrequency: uValue(frequency),
    uAmplitude: uValue(amplitude),
    uDistSpeed: uValue(distSpeed),
    uColorMultiplier: uValue(colorMultiplier),
  };
};
