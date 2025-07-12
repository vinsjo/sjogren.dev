import type { MeshProps } from '@react-three/fiber';
import type { IUniform, Vector3 } from 'three';

import type { MinMax } from '@/types';

export type BlobShaderOptions = {
  alpha: number;
  lightThreshold: Vector3;
  frequency: Vector3;
  amplitude: Vector3;
  distSpeed: Vector3;
  colorMultiplier: Vector3;
};

type BlobUniformValues = BlobShaderOptions & {
  time: number;
};

export type BlobUniforms = {
  [K in keyof BlobUniformValues as `u${Capitalize<K>}`]: IUniform<
    BlobUniformValues[K]
  >;
};

export type BlobMeshOptions = {
  scale: Vector3;
  rotationSpeed: Vector3;
};

export type BlobOptions = {
  mesh: BlobMeshOptions;
  shader: BlobShaderOptions;
};

/**
 * Limits as {@link MinMax} objects when generating random {@link BlobOptions}
 */
export type RandomBlobOptionsLimits = {
  [K in keyof BlobOptions]: { [U in keyof BlobOptions[K]]: MinMax };
};

export interface RequiredBlobProps
  extends Pick<MeshProps, 'position' | 'scale'> {
  position: Vector3;
  scale: Vector3;
}
