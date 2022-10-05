import { useState, useMemo, useEffect, useCallback } from 'react';
import { PerspectiveCamera, Vector3 } from 'three';
import { MathUtils } from 'three';
import { randomV3, v2, v3, equalV3, visibleSizeAtZ } from '@utils/client/three';
import { minmax, rand_neg } from '@utils/misc';
import Blob from './Blob';
import { useThree } from '@react-three/fiber';
import useScreenSize from '@hooks/useScreenSize';
import useWindowSize from '@hooks/useWindowSize';

type BlobPropArray = { position: Vector3; scale: Vector3 }[];

const initBlobs = (cols: number, rows: number, camera: PerspectiveCamera) => {
    if (!cols || !rows) return [] as BlobPropArray;
    const visible = visibleSizeAtZ(0, camera);
    const maxRad = Math.min(visible.x / cols / 2, visible.y / rows / 2);
    const radLimits = minmax(maxRad * 0.8, maxRad * 1.2);
    const avgRad = (radLimits.max + radLimits.min) / 2;
    const blobs: BlobPropArray = [];
    const center = v3(0, 0, 0);
    const maxPos = v2((avgRad * cols) / 2, (avgRad * rows) / 2);
    for (let row = 0; row < rows; row++) {
        const y =
            MathUtils.mapLinear(row, 0, rows - 1, -maxPos.y, maxPos.y) || 0;
        for (let col = 0; col < cols; col++) {
            const x =
                MathUtils.mapLinear(col, 0, cols - 1, -maxPos.x, maxPos.x) || 0;
            const z = rand_neg(avgRad / 3);
            const position = v3(
                x + rand_neg(avgRad / 3),
                y + rand_neg(avgRad / 3),
                z
            ).lerp(center, Math.random() * 0.4);
            blobs.push({
                position,
                scale: randomV3(radLimits.min, radLimits.max),
            });
        }
    }
    return blobs;
};

const fitBlobsInView = (blobs: BlobPropArray, camera: PerspectiveCamera) => {
    const aspect = MathUtils.clamp(camera.aspect, 0.5, 1.2);
    const maxCover = 0.95;
    return blobs.map((blob) => {
        let s = blob.scale;
        let p = blob.position;
        let { x, y, z } = p;
        const visible = visibleSizeAtZ(z, camera);
        const maxRadius = Math.max(s.x, s.y, s.z);
        const limit = v2(
            (visible.x * maxCover) / 2,
            (visible.y * maxCover) / 2
        );
        if (limit.x - maxRadius < 0) x = 0;
        if (limit.y - maxRadius < 0) y = 0;
        if (y) {
            y = MathUtils.clamp(
                y / aspect,
                -limit.y + maxRadius,
                limit.y - maxRadius
            );
        }
        if (x) {
            x = MathUtils.clamp(
                x * aspect,
                -limit.x + maxRadius,
                limit.x - maxRadius
            );
        }
        const minLimit = Math.min(limit.x, limit.y);
        if (minLimit - maxRadius < 0 && (x === 0 || y === 0)) {
            s = s.clone().clamp(equalV3(0), equalV3(minLimit));
        }
        if (x !== p.x || y !== p.y) p = v3(x, y, z);
        return p !== blob.position || s !== blob.scale
            ? { position: p, scale: s }
            : blob;
    });
};

const Blobs = () => {
    const screenSize = useScreenSize();
    const camera = useThree(
        useCallback(({ camera }) => camera as PerspectiveCamera, [])
    );
    const { width, height } = useThree(useCallback(({ size }) => size, []));
    const portrait = useMemo(() => width < height, [width, height]);

    const blobPxSize = useMemo(() => {
        const { width, height } = screenSize;
        if (!width || !height) return 0;
        return Math.round(Math.max(width, height) / 5);
    }, [screenSize]);

    const [cols, rows] = useMemo(() => {
        if (!width || !height || !blobPxSize) return [0, 0];
        const cols = Math.ceil(width / blobPxSize);
        const rows = Math.ceil(height / blobPxSize);
        return [cols, rows];
    }, [width, height, blobPxSize]);

    const [initialBlobs, setInitialBlobs] = useState<BlobPropArray>([]);

    const adjustedBlobs = useMemo<BlobPropArray>(() => {
        return !initialBlobs.length ? [] : fitBlobsInView(initialBlobs, camera);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialBlobs, camera, width, height]);

    useEffect(() => {
        setInitialBlobs(initBlobs(cols, rows, camera));
    }, [camera, cols, rows, portrait]);

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
