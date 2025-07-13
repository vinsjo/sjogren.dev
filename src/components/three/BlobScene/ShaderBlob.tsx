import { useMemo, useRef, useState } from 'react';
import { SphereGeometry, ShaderMaterial, Mesh } from 'three';
import { type ThreeEvent, useFrame } from '@react-three/fiber';

import { createBlobShaderMaterial, getRandomBlobOptions } from './utils';
import type { BlobRenderProps } from './types';

export interface ShaderBlobProps
  extends Pick<BlobRenderProps, 'position' | 'scale'> {
  /**
   * @default 1
   */
  radius?: number;
  /**
   * @default 64
   */
  widthSegments?: number;
  /**
   * @default 32
   */
  heightSegments?: number;
}

export const ShaderBlob = ({
  scale,
  position,
  radius = 1,
  widthSegments = 64,
  heightSegments = 32,
}: ShaderBlobProps) => {
  const [{ shader: shaderOptions, mesh: meshOptions }, setOptions] = useState(
    () => getRandomBlobOptions(),
  );

  const [geometry] = useState(
    () => new SphereGeometry(radius, widthSegments, heightSegments),
  );

  const material = useMemo(
    () => createBlobShaderMaterial(shaderOptions),
    [shaderOptions],
  );

  const meshRef = useRef<Mesh<SphereGeometry, ShaderMaterial>>(null);

  const rotationSpeed = meshOptions.rotationSpeed;

  useFrame(() => {
    if (!meshRef.current) return;
    const {
      rotation,
      material: { uniforms },
    } = meshRef.current;

    (['x', 'y', 'z'] satisfies Array<keyof typeof rotation>).forEach((key) => {
      rotation[key] += rotationSpeed[key] || 0;
    });

    uniforms.uTime.value += 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      scale={scale ?? meshOptions.scale}
      position={position}
      geometry={geometry}
      material={material}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        setOptions(getRandomBlobOptions());
      }}
    />
  );
};
