import { useMemo } from 'react';

import { type PerspectiveCamera } from 'three';
import { useThree } from '@react-three/fiber';

import { getScreenSize } from '@/utils/misc';

import { clamp } from '@/utils/math';

import { fitBlobsInView, getInitialBlobProps } from './utils';

import { ShaderBlob } from './ShaderBlob';

const BlobGroup: React.FC = () => {
  const camera = useThree((state) => state.camera as PerspectiveCamera);
  const canvasWidth = useThree((state) => state.size.width);
  const canvasHeight = useThree((state) => state.size.height);

  const gridSize = useMemo(() => {
    const screenSize = getScreenSize();
    // Calculate approximate 'cell' size based on longest side of the screen / 5
    const cellSize = Math.round(
      Math.max(screenSize.width, screenSize.height) / 5,
    );

    const cols = Math.ceil(canvasWidth / cellSize) || 0;
    const rows = Math.ceil(canvasHeight / cellSize) || 0;

    return { cols: clamp(cols, 1, 20), rows: clamp(rows, 1, 20) };
  }, [canvasWidth, canvasHeight]);

  // Re-initialize blobs if grid size changes
  const baseBlobProps = useMemo(
    () => getInitialBlobProps(gridSize.cols, gridSize.rows, camera),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridSize.cols, gridSize.rows],
  );

  /**
   * {@link baseBlobProps} adjusted to fit in view
   */
  const adjustedBlobProps = useMemo(
    () => fitBlobsInView(baseBlobProps, camera),
    // Include canvas size in dependencies to recalculate when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseBlobProps, camera, canvasWidth, canvasHeight],
  );

  return (
    <group>
      {adjustedBlobProps.map(({ id, ...props }) => {
        return <ShaderBlob key={id} {...props} />;
      })}
    </group>
  );
};

export default BlobGroup;
