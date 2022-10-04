import { useState, useMemo, useEffect } from 'react';
import { PerspectiveCamera, Vector3 } from 'three';
import { MathUtils } from 'three';
import { randomV3, v2, v3, equalV3, visibleSizeAtZ } from '@utils/client/three';
import { minmax, rand_neg } from '@utils/misc';
import Blob from './Blob';
import { useThree } from '@react-three/fiber';

type BlobPropArray = { position: Vector3; scale: Vector3 }[];

const initBlobs = (count: number, camera: PerspectiveCamera) => {
    const visible = visibleSizeAtZ(0, camera);
    const cols = Math.floor(count ** 0.5);
    const rows = Math.ceil(count / cols);
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
            const z = rand_neg(avgRad / 2);
            const position = v3(
                x + rand_neg(avgRad / 2),
                y + rand_neg(avgRad / 2),
                z
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
    initialBlobs: BlobPropArray,
    camera: PerspectiveCamera
) => {
    return initialBlobs.map((blob) => {
        const s = blob.scale;
        const p = blob.position.clone();
        const visible = visibleSizeAtZ(p.z, camera);
        const { aspect } = camera;
        const maxRadius = Math.max(s.x, s.y, s.z);
        const limit = v2(visible.x * 0.45, visible.y * 0.45);
        p.y =
            p.y && limit.y - maxRadius > 0
                ? MathUtils.clamp(
                      limit.y >= limit.x ? p.y / aspect : p.y,
                      -limit.y + maxRadius,
                      limit.y - maxRadius
                  )
                : 0;
        p.x =
            p.x && limit.x - maxRadius > 0
                ? MathUtils.clamp(
                      limit.x >= limit.y ? p.x * aspect : p.x,
                      -limit.x + maxRadius,
                      limit.x - maxRadius
                  )
                : 0;
        const minLimit = Math.min(limit.x, limit.y);
        return {
            position: p,
            scale:
                (p.x === 0 || p.y === 0) && minLimit - maxRadius <= 0
                    ? s.clone().clamp(equalV3(0), equalV3(minLimit))
                    : s,
        };
    });
};

const Blobs = () => {
    const camera = useThree(({ camera }) => camera as PerspectiveCamera);
    const { width, height } = useThree(({ size }) => size);
    const orientation = useMemo(() => width >= height, [width, height]);

    const count = useMemo(() => {
        if (!width || !height) return 0;
        return Math.ceil(Math.max(width, height) / 50);
    }, [width, height]);

    const [initialBlobs, setInitialBlobs] = useState<BlobPropArray>([]);

    const adjustedBlobs = useMemo<BlobPropArray>(() => {
        return !initialBlobs.length ? [] : fitBlobsInView(initialBlobs, camera);
    }, [initialBlobs, camera]);

    useEffect(() => {
        if (!count) return;
        setInitialBlobs(initBlobs(count, camera));
    }, [camera, count, orientation]);

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
