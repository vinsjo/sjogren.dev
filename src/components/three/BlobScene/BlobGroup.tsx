import { useReducer, useState } from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

import { PerspectiveCamera } from 'three';

import { getScreenSize } from '@/utils/misc';

import { type RootState, useThree } from '@react-three/fiber';

import { fitBlobsInView, getInitialBlobProps } from './utils';

import type { RequiredBlobProps } from './types';

import { ShaderBlob } from './ShaderBlob';

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
   * Cell size in 'grid' in pixels
   */
  cellSize: number;
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
const getGridCellSize = (): number => {
  const longestSide = Math.max(...getScreenSize());
  return longestSide && Math.round(longestSide / 5);
};

const getGridSize = (
  canvasWidth: number,
  canvasHeight: number,
  cellSize: number,
): GridSize => {
  if (!canvasWidth || !canvasHeight || !cellSize) {
    return [0, 0];
  }

  return [
    Math.ceil(canvasWidth / cellSize),
    Math.ceil(canvasHeight / cellSize),
  ];
};

/**
 * Check if `aspect`, `fov` and `position` of two cameras are equal.
 */
const isEqualCameras = (a: StateRefs['camera'], b: StateRefs['camera']) => {
  return (
    a.aspect === b.aspect && a.fov === b.fov && a.position.equals(b.position)
  );
};

const getInitialState = (refs: StateRefs, gridSize?: GridSize): State => {
  const { canvasWidth, canvasHeight, cellSize: blobSize, camera } = refs;
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
  const isEqualCellSize = state.refs.cellSize === refs.cellSize;
  const isEqualCanvasSize =
    state.refs.canvasWidth === refs.canvasWidth &&
    state.refs.canvasHeight === refs.canvasHeight;
  const isEqualCamera = isEqualCameras(state.refs.camera, refs.camera);

  // Skip if refs are equal
  if (isEqualCanvasSize && isEqualCamera && isEqualCellSize) {
    return state;
  }

  const gridSize = getGridSize(
    refs.canvasWidth,
    refs.canvasHeight,
    refs.cellSize,
  );

  // Re-initialize if grid size changes
  if (!state.gridSize.every((value, i) => value === gridSize[i])) {
    return getInitialState(refs, gridSize);
  }

  return {
    ...state,
    refs,
    adjustedBlobs: fitBlobsInView(state.blobs, refs.camera),
  };
};

type ThreeStateSelector<U = unknown> = (state: RootState) => U;

const threeStateSelectors = {
  width: (state) => state.size.width,
  height: (state) => state.size.height,
  camera: (state) => state.camera as PerspectiveCamera,
} satisfies Record<string, ThreeStateSelector>;

const BlobGroup: React.FC = () => {
  const [gridCellSize, setGridCellSize] = useState(() => getGridCellSize());

  const canvasWidth = useThree(threeStateSelectors.width);
  const canvasHeight = useThree(threeStateSelectors.height);
  const camera = useThree(threeStateSelectors.camera);

  const [state, dispatch] = useReducer<
    React.Reducer<State, StateRefs>,
    StateRefs
  >(
    reducer,
    {
      camera,
      canvasWidth,
      canvasHeight,
      cellSize: gridCellSize,
    },
    getInitialState,
  );

  useEnhancedEffect(() => {
    setGridCellSize(getGridCellSize());
  }, []);

  useEnhancedEffect(() => {
    dispatch({
      camera,
      canvasHeight,
      canvasWidth,
      cellSize: gridCellSize,
    });
  }, [camera, canvasHeight, canvasWidth, gridCellSize]);

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
