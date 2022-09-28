import React, {
	useState,
	useMemo,
	useEffect,
	useCallback,
	useLayoutEffect,
} from 'react';

import { isFn } from 'x-is-type/callbacks';
import { PerspectiveCamera, Vector3 } from 'three';
import { clamp, mapLinear } from 'three/src/math/MathUtils';
import {
	randomV3,
	v2,
	v3,
	equalV3,
	visibleSizeAtZ,
	updateAspect,
} from '@utils/client/three';
import { minmax, rand, rand_neg, WH } from '@utils/misc';
import useDidMount from '@hooks/useDidMount';
import ShaderBlob from './ShaderBlob';
import ThreeScene from '../ThreeScene';
import useWindowSize from '@hooks/useWindowSize';

type BlobSceneProps = {
	onLoad?: () => unknown;
} & React.HTMLAttributes<HTMLDivElement>;

type BlobPropArray = { position: Vector3; scale: Vector3 }[];

const BlobScene = ({ onLoad, className }: BlobSceneProps) => {
	const didMount = useDidMount();
	const dpr = useMemo(() => {
		return !didMount || !window || !('devicePixelRatio' in window)
			? 1
			: window.devicePixelRatio;
	}, [didMount]);
	const [canvasSize, setCanvasSize] = useState<WH | null>(null);

	const blobCount = useMemo(() => {
		if (!canvasSize) return 0;
		const { width, height } = canvasSize;
		return Math.ceil(Math.max(width, height) / 50);
	}, [canvasSize]);

	const [camera, setCamera] = useState<PerspectiveCamera | null>();
	const [initialBlobs, setInitialBlobs] = useState<BlobPropArray>([]);

	const adjustedBlobs = useMemo(() => {
		if (!camera || !initialBlobs.length || !canvasSize) return [];
		return initialBlobs.map((blob) => {
			const s = blob.scale;
			const p = blob.position.clone();
			const visible = visibleSizeAtZ(p.z, camera);
			const { aspect } = camera;
			const maxRadius = Math.max(s.x, s.y, s.z);
			const limit = v2(visible.x * 0.45, visible.y * 0.45);
			p.y =
				p.y && limit.y - maxRadius > 0
					? clamp(
							p.y / aspect,
							-limit.y + maxRadius,
							limit.y - maxRadius
					  )
					: 0;
			p.x =
				p.x && limit.x - maxRadius > 0
					? clamp(
							p.x * aspect,
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
	}, [initialBlobs, canvasSize, camera]);

	const handleResize = useCallback(
		({ width, height }: WH) => {
			// Wait until canvas has adjusted to container to set canvas size
			if (!width || !height || (width === 300 && height === 150)) return;
			setCanvasSize({ width, height });
			if (!camera) return;
			updateAspect(camera, { width, height });
		},
		[camera]
	);

	const handleLoad = useCallback(() => {
		isFn(onLoad) && onLoad();
	}, [onLoad]);

	useLayoutEffect(() => {
		if (camera) return;
		const c = new PerspectiveCamera(15, 1, 0.1, 500);
		c.position.set(0, 0, 20);
		c.lookAt(v3(0, 0, 0));
		setCamera(c);
	}, [camera]);

	useEffect(() => {
		if (!camera || !blobCount) return;
		setInitialBlobs(initBlobs(camera, blobCount));
	}, [camera, blobCount]);

	return (
		<ThreeScene
			className={className || null}
			fpsLimit={30}
			shadows={false}
			dpr={dpr}
			camera={camera}
			gl={{ antialias: false }}
			onCreated={handleLoad}
			onResize={handleResize}
		>
			<group>
				{adjustedBlobs.map(({ position, scale }, i) => {
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
		</ThreeScene>
	);
};

function initBlobsCircular(camera: PerspectiveCamera, count: number = 20) {
	const scaleLimits = minmax(0.8, 1.2);
	let avgScale = (scaleLimits.max + scaleLimits.min) / 2;
	const visible = visibleSizeAtZ(0, camera);
	let angle = 0;
	let currentCircle = 0;
	const circles = Math.ceil(count / 10);
	const visibleR = Math.min(visible.x / 2, visible.y / 2);
	const r = visibleR - avgScale;
	const step = ((Math.PI * 2) / count) * circles;

	const circ = 2 * r * Math.PI;
	const maxScale = (circ / count) * (circles / 2);
	if (avgScale > maxScale) {
		const { max, min } = scaleLimits;
		scaleLimits.max = mapLinear(max, 0, avgScale, 0, maxScale);
		scaleLimits.min = mapLinear(min, 0, avgScale, 0, maxScale);
		avgScale = (scaleLimits.max + scaleLimits.min) / 2;
	}
	const blobs: BlobPropArray = [];
	const center = v3(0, 0, 0);
	while (blobs.length < count) {
		const position = v3(
			r * Math.sin(angle) * rand(0.5, 1.5),
			r * Math.cos(angle) * rand(0.5, 1.5),
			rand_neg(avgScale)
		).lerp(center, Math.random() * 0.8);
		blobs.push({
			position,
			scale: randomV3(scaleLimits.min, scaleLimits.max),
		});
		const maxAngle = Math.PI * 2 * (currentCircle + 1);
		if (angle < maxAngle && angle + step >= maxAngle) {
			currentCircle += 1;
		}
		angle += step;
	}
	return blobs;
}

function initBlobs(camera: PerspectiveCamera, count = 10) {
	const { aspect } = camera;
	const visible = visibleSizeAtZ(0, camera);
	const cols = Math.floor(count ** clamp(aspect, 0.4, 0.6));
	const rows = Math.ceil(count / cols);
	const maxRadius = Math.min(visible.x / cols, visible.y / rows);
	const scaleLimits = minmax(maxRadius * 0.8, maxRadius * 1.2);
	const avgScale = (scaleLimits.max + scaleLimits.min) / 2;
	const blobs = [];
	const center = v3(0, 0, 0);
	for (let row = 1; row <= rows; row++) {
		for (let col = 1; col <= cols; col++) {
			const z = rand_neg(scaleLimits.max);
			const v = visibleSizeAtZ(z, camera);
			const offset = v2(
				v.x * 0.5 - avgScale * 1.5,
				v.y * 0.5 - avgScale * 1.5
			);
			const position = v3(
				mapLinear(col, 1, cols, -offset.x, offset.x) * rand(0.8, 1.1),
				mapLinear(row, 1, rows, -offset.y, offset.y) * rand(0.8, 1.1),
				z
			).lerp(center, Math.random() * 0.5);
			blobs.push({
				position,
				scale: randomV3(scaleLimits.min, scaleLimits.max),
			});
		}
	}
	return blobs as BlobPropArray;
}

export default BlobScene;
