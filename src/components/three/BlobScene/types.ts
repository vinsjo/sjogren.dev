import type { MeshProps } from '@react-three/fiber';
import type { IUniform, Vector3 } from 'three';
import type { MinMax } from '@/types';

export type BlobShaderOptions = {
  lightThreshold: Vector3;
  frequency: Vector3;
  amplitude: Vector3;
  distSpeed: Vector3;
  colorMultiplier: Vector3;
};

export type BlobUniforms = {
  uTime: IUniform<number>;
} & {
  [K in keyof BlobShaderOptions as `u${Capitalize<K>}`]: IUniform<
    BlobShaderOptions[K]
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

export type PartialRandomBlobOptionsLimits = {
  [K in keyof RandomBlobOptionsLimits]?: Partial<RandomBlobOptionsLimits[K]>;
};

export interface BlobRenderProps extends Pick<MeshProps, 'position' | 'scale'> {
  /**
   * Unique identifier for the blob, used as React key.
   */
  id: string;
  position: Vector3;
  scale: Vector3;
}
