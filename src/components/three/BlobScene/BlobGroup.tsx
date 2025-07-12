import { useReducer, useState } from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

import { PerspectiveCamera } from 'three';

import { getScreenSize } from '@/utils/misc';

import { type RootState, useThree } from '@react-three/fiber';

import { fitBlobsInView, getInitialBlobProps } from './utils';

import type { RequiredBlobProps } from './types';

import { ShaderBlob } from './ShaderBlob';

type ThreeStateSelector<U = unknown> = (state: RootState) => U;

const threeStateSelectors = {
  width: (state) => state.size.width,
  height: (state) => state.size.height,
  camera: (state) => state.camera as PerspectiveCamera,
} satisfies Record<string, ThreeStateSelector>;

type GridSize = [cols: number, rows: number];

type StateRefs = {
  /**
   * Canvas height in pixels
   */
  canvasHeight: number;
  /**
   * Canvas width in pixels
   */
  canvasWidth: number;
  /**
   * Blob size, based on screen size
   */
  blobSize: number;
  /**
   * Camera used to calculate blob positions and sizes
   * (only `position`, `fov` and `aspect` are used)
   */
  camera: PerspectiveCamera;
};

type State = {
  /**
   * Columns and rows in grid.
   */
  gridSize: GridSize;
  /**
   * Array of {@link RequiredBlobProps} to render,
   * without adjustments for camera position and canvas size.
   */
  blobs: RequiredBlobProps[];
  /**
   * `blobs` array, mapped to fit into view
   */
  adjustedBlobs: RequiredBlobProps[];
  /**
   * {@link StateRefs} to be able to determine if state should be updated or not
   */
  refs: StateRefs;
};

/**
 * Get blob size in pixels based on current screen size,
 * or 0 when SSR
 */
const getBlobSize = (): number => {
  const longestSide = Math.max(...getScreenSize());
  return longestSide && Math.round(longestSide / 5);
};

const getGridSize = (
  canvasWidth: number,
  canvasHeight: number,
  blobSize: number,
): GridSize => {
  if (canvasHeight && canvasWidth && blobSize) {
    return [
      Math.ceil(canvasWidth / blobSize) || 0,
      Math.ceil(canvasWidth / blobSize) || 0,
    ];
  }
  return [0, 0];
};

/**
 * Check if `aspect`, `fov` and `position` of two cameras are equal.
 */
const isEqualCameraRefs = (a: StateRefs['camera'], b: StateRefs['camera']) => {
  return (
    a.aspect === b.aspect && a.fov === b.fov && a.position.equals(b.position)
  );
};

const getInitialState = (refs: StateRefs, gridSize?: GridSize): State => {
  const { canvasWidth, canvasHeight, blobSize, camera } = refs;
  if (!gridSize) {
    gridSize = getGridSize(canvasWidth, canvasHeight, blobSize);
  }
  const blobs = getInitialBlobProps(...gridSize, refs.camera);
  const adjustedBlobs = fitBlobsInView(blobs, camera);

  return {
    gridSize,
    blobs,
    adjustedBlobs,
    refs,
  };
};

const reducer: React.Reducer<State, StateRefs> = (
  state: State,
  refs: StateRefs,
): State => {
  const isEqualBlobSize = state.refs.blobSize === refs.blobSize;
  const isEqualCanvasSize =
    state.refs.canvasWidth === refs.canvasWidth &&
    state.refs.canvasHeight === refs.canvasHeight;
  const isEqualCamera = isEqualCameraRefs(state.refs.camera, refs.camera);

  // Skip if refs are equal
  if (isEqualCanvasSize && isEqualCamera && isEqualBlobSize) {
    return state;
  }

  const gridSize =
    isEqualCanvasSize && isEqualBlobSize
      ? state.gridSize
      : getGridSize(refs.canvasWidth, refs.canvasHeight, refs.blobSize);

  const isEqualGridSize =
    gridSize !== state.gridSize &&
    state.gridSize.every((value, i) => value === gridSize[i]);

  if (!isEqualGridSize) {
    return getInitialState(refs, gridSize);
  }

  return {
    ...state,
    refs,
    adjustedBlobs: fitBlobsInView(state.blobs, refs.camera),
  };
};

const BlobGroup: React.FC = () => {
  const [blobSize, setBlobSize] = useState(() => getBlobSize());

  const canvasWidth = useThree(threeStateSelectors.width);
  const canvasHeight = useThree(threeStateSelectors.height);
  const camera = useThree(threeStateSelectors.camera);

  const [state, dispatch] = useReducer<
    React.Reducer<State, StateRefs>,
    StateRefs
  >(
    reducer,
    {
      blobSize,
      canvasWidth,
      canvasHeight,
      camera,
    },
    getInitialState,
  );

  useEnhancedEffect(() => {
    setBlobSize(getBlobSize());
  }, []);

  useEnhancedEffect(() => {
    dispatch({ camera, canvasHeight, canvasWidth, blobSize });
  }, [camera, canvasHeight, canvasWidth, blobSize]);

  return (
    <group>
      {state.adjustedBlobs.map(({ position, scale }, i) => {
        return (
          <ShaderBlob
            key={`blob-${i}`}
            position={position}
            scale={scale}
            radius={1}
          />
        );
      })}
    </group>
  );
};

export default BlobGroup;
