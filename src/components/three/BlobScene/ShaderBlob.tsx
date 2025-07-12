import { useRef, useEffect, useState } from 'react';
import { SphereGeometry, ShaderMaterial, Mesh } from 'three';
import { type MeshProps, type ThreeEvent, useFrame } from '@react-three/fiber';
import useEventCallback from '@mui/utils/useEventCallback';

import { createBlobShaderMaterial, getRandomBlobOptions } from './utils';
import type { BlobOptions } from './types';

export interface ShaderBlobProps
  extends Omit<MeshProps, 'geometry' | 'onClick' | 'material'> {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  randomRefresh?: number;
}

type State = {
  options: BlobOptions;
  material: ShaderMaterial;
};

const getRandomizedState = (): State => {
  const options = getRandomBlobOptions();
  return {
    options,
    material: createBlobShaderMaterial(options.shader),
  };
};

export const ShaderBlob = ({
  radius = 1,
  widthSegments = 64,
  heightSegments = 32,
  scale,
  randomRefresh,
  ...meshProps
}: ShaderBlobProps) => {
  const [{ options, material }, setState] = useState(() =>
    getRandomizedState(),
  );

  const [geometry] = useState(
    () => new SphereGeometry(radius, widthSegments, heightSegments),
  );

  const mesh = useRef<Mesh<SphereGeometry, ShaderMaterial>>(null);

  const handleClick = useEventCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setState(getRandomizedState());
  });

  const rotationSpeed = options.mesh.rotationSpeed;

  useFrame(() => {
    if (!mesh.current) return;

    const {
      rotation,
      material: { uniforms },
    } = mesh.current;

    (['x', 'y', 'z'] satisfies Array<keyof typeof rotationSpeed>).forEach(
      (key) => {
        if (rotationSpeed[key] === 0) return;
        rotation[key] += rotationSpeed[key];
      },
    );
    uniforms.uTime.value += 0.1;
  });

  useEffect(() => {
    if (!randomRefresh) return;

    const timeout = setTimeout(
      () => setState(getRandomizedState()),
      Math.floor(Math.random() * randomRefresh),
    );

    return () => clearTimeout(timeout);
  }, [randomRefresh, options]);

  return (
    <mesh
      ref={mesh}
      scale={scale ?? options.mesh.scale}
      geometry={geometry}
      material={material}
      onClick={handleClick}
      {...meshProps}
    />
  );
};
