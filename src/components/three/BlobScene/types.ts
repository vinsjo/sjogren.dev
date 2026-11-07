import type { ThreeElements } from '@react-three/fiber';
import type { IUniform, Vector3 } from 'three';

export type BlobShaderOptions = {
  lightThreshold: Vector3;
  frequency: Vector3;
  amplitude: Vector3;
  distSpeed: Vector3;
  colorMultiplier: Vector3;
};

export type BlobMeshOptions = {
  scale: Vector3;
  /** Radians per second, in all directions */
  rotationSpeed: Vector3;
};

export type BlobUniforms = {
  uTime: IUniform<number>;
} & {
  [K in keyof BlobShaderOptions as `u${Capitalize<K>}`]: IUniform<
    BlobShaderOptions[K]
  >;
};

export type BlobOptions = {
  mesh: BlobMeshOptions;
  shader: BlobShaderOptions;
};

export interface BlobRenderProps extends Pick<
  ThreeElements['mesh'],
  'position' | 'scale'
> {
  /**
   * Unique identifier for the blob, used as React key.
   */
  id: string;
  position: Vector3;
  scale: Vector3;
}
