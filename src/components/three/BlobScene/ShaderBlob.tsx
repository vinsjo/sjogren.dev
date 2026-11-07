import { useMemo, useRef, useState } from 'react';
import { SphereGeometry, type Mesh, type ShaderMaterial } from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';

import { createBlobShaderMaterial, getRandomBlobOptions } from './utils';
import type { BlobRenderProps } from './types';

export type ShaderBlobProps = Pick<BlobRenderProps, 'position' | 'scale'>;

const geometry = new SphereGeometry(1, 64, 32);

export const ShaderBlob = ({ scale, position }: ShaderBlobProps) => {
  const [{ shader: shaderOptions, mesh: meshOptions }, setOptions] = useState(
    () => getRandomBlobOptions(),
  );

  const material = useMemo(
    () => createBlobShaderMaterial(shaderOptions),
    [shaderOptions],
  );

  const meshRef = useRef<Mesh<SphereGeometry, ShaderMaterial>>(null);

  const rotationSpeed = meshOptions.rotationSpeed;

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.x += rotationSpeed.x * delta;
    mesh.rotation.y += rotationSpeed.y * delta;
    mesh.rotation.z += rotationSpeed.z * delta;

    mesh.material.uniforms.uTime.value += delta;
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
