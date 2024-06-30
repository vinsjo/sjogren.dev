import { useRef, useEffect, useReducer } from 'react';
import { SphereGeometry, ShaderMaterial, Mesh } from 'three';
import { type MeshProps, type ThreeEvent, useFrame } from '@react-three/fiber';
import { isNum } from 'x-is-type';
import { blobShader, getRandomOptions, type BlobOptions } from './blob-shader';

export type ShaderBlobProps = Omit<
  MeshProps,
  'geometry' | 'onClick' | 'material'
> & {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  randomRefresh?: number;
};

const getRandomizedState = (): State => {
  const options = getRandomOptions();
  return {
    options,
    material: blobShader(options.shader),
  };
};

type State = {
  options: BlobOptions;
  material: ShaderMaterial;
};

type Action = { type: 'randomize' };

const ShaderBlob = ({
  radius,
  widthSegments,
  heightSegments,
  scale,
  randomRefresh,
  ...meshProps
}: ShaderBlobProps) => {
  const [{ options, material }, dispatch] = useReducer(
    (prevState: State, action: Action) => {
      if (action.type === 'randomize') {
        return getRandomizedState();
      }
      return prevState;
    },
    null,
    getRandomizedState,
  );

  const sphere = useRef(
    new SphereGeometry(
      isNum(radius) ? radius : 1,
      isNum(widthSegments) ? widthSegments : 64,
      isNum(heightSegments) ? heightSegments : 32,
    ),
  ).current;

  const mesh = useRef<Mesh<SphereGeometry, ShaderMaterial>>(null);

  const handleClick = useRef((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    dispatch({ type: 'randomize' });
  }).current;

  useFrame(() => {
    if (!mesh.current) return;

    const {
      rotation,
      material: { uniforms },
    } = mesh.current;

    const { rotationSpeed } = options.mesh;

    for (const key of ['x', 'y', 'z'] satisfies Array<keyof typeof rotation>) {
      rotation[key] += rotationSpeed[key];
    }
    uniforms.uTime.value += 0.1;
  });

  useEffect(() => {
    if (!randomRefresh) return;

    const timeout = setTimeout(
      () => dispatch({ type: 'randomize' }),
      Math.floor(Math.random() * randomRefresh),
    );

    return () => clearTimeout(timeout);
  }, [randomRefresh, options]);

  return (
    <mesh
      ref={mesh}
      scale={scale ?? options.mesh.scale}
      geometry={sphere}
      material={material}
      onClick={handleClick}
      {...meshProps}
    />
  );
};

export default ShaderBlob;
