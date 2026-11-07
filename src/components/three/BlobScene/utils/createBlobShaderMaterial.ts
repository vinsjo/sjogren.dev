import { ShaderMaterial } from 'three';
import { uValue } from '@/utils/three';
import type { BlobShaderOptions, BlobUniforms } from '../types';

const fragmentShader = `
uniform vec3 uLightThreshold;
uniform vec3 uColorMultiplier;

varying vec3 vNormal;

void main() {
  vec3 color = uColorMultiplier * (vNormal * uLightThreshold + (1.0 - uLightThreshold));
  gl_FragColor = vec4(color, 1.0);
}`;

const vertexShader = `
uniform float uTime;
uniform vec3 uFrequency;
uniform vec3 uAmplitude;
uniform vec3 uDistSpeed;

varying vec3 vNormal;

void main() {
  vec3 distortion = sin(position * uFrequency + uTime * uDistSpeed);
  vec3 displaced = position + distortion * normal * uAmplitude;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  vNormal = normal;
}`;

export const createBlobShaderMaterial = ({
  lightThreshold,
  frequency,
  amplitude,
  distSpeed,
  colorMultiplier,
}: BlobShaderOptions): ShaderMaterial => {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: uValue(0.0),
      uLightThreshold: uValue(lightThreshold),
      uFrequency: uValue(frequency),
      uAmplitude: uValue(amplitude),
      uDistSpeed: uValue(distSpeed),
      uColorMultiplier: uValue(colorMultiplier),
    } satisfies BlobUniforms,
  });
};
