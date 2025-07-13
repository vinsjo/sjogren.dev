import { useEffect, useMemo, useRef, useState } from 'react';

import { PerspectiveCamera } from 'three';
import { useThree, type RootState as ThreeState } from '@react-three/fiber';

import { useIsomorphicLayoutEffect } from 'usehooks-ts';

import type { WH } from '@/types';

import { getScreenSize, hasEqualProps } from '@/utils/misc';

import { clamp } from '@/utils/math';

import { fitBlobsInView, getInitialBlobProps } from './utils';

import { ShaderBlob } from './ShaderBlob';
import type { BlobRenderProps } from './types';

type GridSize = { cols: number; rows: number };

const canvasSizeSelector = (state: ThreeState) => state.size;
const cameraSelector = (state: ThreeState) => state.camera as PerspectiveCamera;

const isEqualSizes = (a: WH, b: WH) => hasEqualProps(a, b, ['width', 'height']);

/**
 * Check if `aspect`, `fov` and `position` of two cameras are equal.
 */
const isEqualCameras = (a: PerspectiveCamera, b: PerspectiveCamera) => {
  if (a === b) return true;

  return (
    hasEqualProps(a, b, ['aspect', 'fov']) && a.position.equals(b.position)
  );
};

const BlobGroup: React.FC = () => {
  const canvasSize = useThree(canvasSizeSelector, isEqualSizes);
  const camera = useThree(cameraSelector, isEqualCameras);

  const [screenSize, setScreenSize] = useState(() => getScreenSize());

  const gridSize = useMemo(() => {
    // Calculate approximate 'cell' size based on longest side of the screen / 5
    const cellSize = Math.round(
      Math.max(screenSize.width, screenSize.height) / 5,
    );

    const cols = Math.ceil(canvasSize.width / cellSize) || 0;
    const rows = Math.ceil(canvasSize.height / cellSize) || 0;

    return { cols: clamp(cols, 1, 20), rows: clamp(rows, 1, 20) };
  }, [screenSize, canvasSize]);

  const gridSizeRef = useRef<GridSize>(gridSize);

  const [baseBlobProps, setBaseBlobProps] = useState<BlobRenderProps[]>(() =>
    getInitialBlobProps(gridSize.cols, gridSize.rows, camera),
  );

  /**
   * {@link baseBlobProps} adjusted to fit in view
   */
  const adjustedBlobProps = useMemo(
    () => fitBlobsInView(baseBlobProps, camera),
    // Include canvas size in dependencies to recalculate when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseBlobProps, camera, canvasSize.width, canvasSize.height],
  );

  // Update screen size state as soon as possible on mount
  useIsomorphicLayoutEffect(() => {
    const screenSize = getScreenSize();

    setScreenSize((prev) =>
      isEqualSizes(prev, screenSize) ? prev : screenSize,
    );
  }, []);

  // Re-initialize blobs if grid size changes
  useEffect(() => {
    const prevGridSize = gridSizeRef.current;
    gridSizeRef.current = gridSize;

    if (!hasEqualProps(prevGridSize, gridSize, ['cols', 'rows'])) {
      setBaseBlobProps(
        getInitialBlobProps(gridSize.cols, gridSize.rows, camera),
      );
    }
  }, [gridSize, camera]);

  return (
    <group>
      {adjustedBlobProps.map(({ id, ...props }) => {
        return <ShaderBlob key={id} {...props} />;
      })}
    </group>
  );
};

export default BlobGroup;
