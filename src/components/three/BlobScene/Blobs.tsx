import { useEffect, useMemo, useState } from 'react';
import { isNum } from 'x-is-type';

import { PerspectiveCamera, Vector3, MathUtils } from 'three';

import { type RootState, useThree } from '@react-three/fiber';

import { rand_neg } from '@/utils/math';
import { randomV3, v2, v3, equalV3, visibleSizeAtZ } from '@/utils/three';
import { getScreenSize, minmax } from '@/utils/misc';

import Blob from './Blob';

type BlobProps = { position: Vector3; scale: Vector3 };

const initBlobs = (
  cols: number,
  rows: number,
  camera: PerspectiveCamera,
): BlobProps[] => {
  if (!cols || !rows || ![cols, rows].every(isNum)) {
    return [];
  }
  const visible = visibleSizeAtZ(0, camera);
  const maxRad = Math.min(visible.x / cols / 2, visible.y / rows / 2);
  const radLimits = minmax(maxRad * 0.8, maxRad * 1.2);
  const avgRad = (radLimits.max + radLimits.min) / 2;
  const blobs: BlobProps[] = [];
  const center = v3(0, 0, 0);
  const maxPos = v2((avgRad * cols) / 2, (avgRad * rows) / 2);
  for (let row = 0; row < rows; row++) {
    const y = MathUtils.mapLinear(row, 0, rows - 1, -maxPos.y, maxPos.y) || 0;
    for (let col = 0; col < cols; col++) {
      const x = MathUtils.mapLinear(col, 0, cols - 1, -maxPos.x, maxPos.x) || 0;
      const position = v3(
        x + rand_neg(avgRad / 2),
        y + rand_neg(avgRad / 2),
        rand_neg(avgRad / 2),
      ).lerp(center, Math.random() * 0.5);
      blobs.push({
        position,
        scale: randomV3(radLimits.min, radLimits.max),
      });
    }
  }
  return blobs;
};

const fitBlobsInView = (
  blobs: BlobProps[],
  camera: PerspectiveCamera,
): BlobProps[] => {
  const aspect = MathUtils.clamp(camera.aspect, 0.5, 1.2);
  const maxCover = 0.9;
  const center = v3(0, 0, 0);
  return blobs.map((blob) => {
    let s = blob.scale;
    let p = blob.position;
    // eslint-disable-next-line prefer-const
    let { x, y, z } = p;
    const visible = visibleSizeAtZ(z, camera);
    const maxRadius = Math.max(s.x, s.y, s.z);
    const limit = v2((visible.x * maxCover) / 2, (visible.y * maxCover) / 2);
    if (limit.x - maxRadius < 0) x = 0;
    if (limit.y - maxRadius < 0) y = 0;
    if (y) {
      y = MathUtils.clamp(
        y / aspect,
        -limit.y + maxRadius,
        limit.y - maxRadius,
      );
    }
    if (x) {
      x = MathUtils.clamp(
        x * aspect,
        -limit.x + maxRadius,
        limit.x - maxRadius,
      );
    }
    const minLimit = Math.min(limit.x, limit.y);
    if (minLimit - maxRadius < 0 && (x === 0 || y === 0)) {
      s = s.clone().clamp(equalV3(0), equalV3(minLimit));
    }
    if (x !== p.x || y !== p.y) p = v3(x, y, z).lerp(center, 0.1);
    return p !== blob.position || s !== blob.scale
      ? { position: p, scale: s }
      : blob;
  });
};

const selectors = {
  width: (state: RootState) => state.size.width,
  height: (state: RootState) => state.size.height,
  camera: (state: RootState) => state.camera as PerspectiveCamera,
};

const Blobs: React.FC = () => {
  const [screenSize, setScreenSize] = useState(getScreenSize);

  const width = useThree(selectors.width);
  const height = useThree(selectors.height);
  const camera = useThree(selectors.camera);

  const [blobSize, setBlobSize] = useState(0);
  const [blobs, setBlobs] = useState<BlobProps[]>([]);
  const [{ cols, rows }, setColsAndRows] = useState({ cols: 0, rows: 0 });

  const adjustedBlobs = useMemo(() => {
    if (!blobs.length) return [];
    return fitBlobsInView(blobs, camera);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blobs, camera, width, height]);

  useEffect(() => {
    const { width, height } = screenSize;
    if (!width || !height) return;
    setBlobSize(Math.round(Math.max(width, height) / 5));
  }, [screenSize]);

  useEffect(() => {
    if (!rows || !cols) return;
    setBlobs(initBlobs(cols, rows, camera));
  }, [cols, rows, camera]);

  useEffect(() => {
    if (!width || !height || !blobSize) return;
    const cols = Math.ceil(width / blobSize);
    const rows = Math.ceil(height / blobSize);
    setColsAndRows((prev) =>
      prev.cols === cols && prev.rows === rows ? prev : { cols, rows },
    );
  }, [width, height, blobSize]);

  useEffect(() => {
    setScreenSize(getScreenSize());
  }, []);

  return (
    <group>
      {adjustedBlobs.map(({ position, scale }, i) => {
        return (
          <Blob
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

// function initBlobsCircular(camera: PerspectiveCamera, count: number = 20) {
// 	const scaleLimits = minmax(0.8, 1.2);
// 	let avgScale = (scaleLimits.max + scaleLimits.min) / 2;
// 	const visible = visibleSizeAtZ(0, camera);
// 	let angle = 0;
// 	let currentCircle = 0;
// 	const circles = Math.ceil(count / 10);
// 	const visibleR = Math.min(visible.x / 2, visible.y / 2);
// 	const r = visibleR - avgScale;
// 	const step = ((Math.PI * 2) / count) * circles;

// 	const circ = 2 * r * Math.PI;
// 	const maxScale = (circ / count) * (circles / 2);
// 	if (avgScale > maxScale) {
// 		const { max, min } = scaleLimits;
// 		scaleLimits.max = mapLinear(max, 0, avgScale, 0, maxScale);
// 		scaleLimits.min = mapLinear(min, 0, avgScale, 0, maxScale);
// 		avgScale = (scaleLimits.max + scaleLimits.min) / 2;
// 	}
// 	const blobs: BlobPropArray = [];
// 	const center = v3(0, 0, 0);
// 	while (blobs.length < count) {
// 		const position = v3(
// 			r * Math.sin(angle) * rand(0.5, 1.5),
// 			r * Math.cos(angle) * rand(0.5, 1.5),
// 			rand_neg(avgScale)
// 		).lerp(center, Math.random() * 0.8);
// 		blobs.push({
// 			position,
// 			scale: randomV3(scaleLimits.min, scaleLimits.max),
// 		});
// 		const maxAngle = Math.PI * 2 * (currentCircle + 1);
// 		if (angle < maxAngle && angle + step >= maxAngle) {
// 			currentCircle += 1;
// 		}
// 		angle += step;
// 	}
// 	return blobs;
// }

export default Blobs;
