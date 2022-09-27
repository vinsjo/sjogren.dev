import React, {
	useState,
	useMemo,
	useRef,
	useEffect,
	useLayoutEffect,
} from 'react';
import { EffectComposer, Noise } from '@react-three/postprocessing';
import ShaderBlob from './ShaderBlob';
import ThreeScene from '../ThreeScene';
import useResizeObserver from '@hooks/useResizeObserver';
import {
	randomV3,
	v2,
	v3,
	isV3,
	equalV3,
	visibleSizeAtZ,
} from '@utils/client/three';
import { isNum, isFn } from 'x-is-type/callbacks';
import { isMinMax, MinMax, minmax, rand_neg } from '@utils/misc';
import { PerspectiveCamera, Vector3 } from 'three';
import { clamp, mapLinear } from 'three/src/math/MathUtils';

type BlobSceneProps = {
	onLoad?: () => unknown;
	className?: string;
	blobCount?: number;
	blobScale?: MinMax;
} & React.HTMLAttributes<HTMLDivElement>;

const BlobScene = (props: BlobSceneProps) => {
	const canvasRef = useRef<HTMLCanvasElement>();
	const { width, height } = useResizeObserver(canvasRef.current);
	const dpr = useMemo(() => {
		return !window ? 0.5 : window.devicePixelRatio * 0.5;
	}, []);
	const aspectRatio = useMemo(
		() => (!width || !height ? 1 : width / height),
		[width, height]
	);

	const [camera, setCamera] = useState<null | PerspectiveCamera>(null);
	// const camera = useRef<PerspectiveCamera>(
	// 	(() => {
	// 		const c = new PerspectiveCamera(getAspect(), getFOV(), 0.1, 500);
	// 		c.position.set(0, 0, 15);
	// 		return c;
	// 	})()
	// );

	const [blobCount, blobScale] = useMemo(() => {
		return [
			!isNum(props.blobCount) ? 20 : props.blobCount,
			!isMinMax(props.blobScale) ? minmax(0.9, 1.1) : props.blobScale,
		];
	}, [props.blobCount, props.blobScale]);

	const initialBlobs = useMemo(() => {
		if (!camera || blobCount < 1) return [];
		const initialProps = (x?: number, y?: number, z?: number) => {
			return {
				position: v3(
					isNum(x) ? x : 0,
					isNum(y) ? y : 0,
					isNum(z) ? z : 0
				),
				scale: randomV3(blobScale.min, blobScale.max),
			};
		};
		if (blobCount === 1) return [initialProps()];
		const visible = visibleSizeAtZ(0, camera);
		const offset = v2(
			visible.x / 2 - blobScale.min,
			visible.y / 2 - blobScale.min
		);
		return [...Array(blobCount)].map(() => {
			return {
				position: v3(
					rand_neg(offset.x),
					rand_neg(offset.y),
					rand_neg(0.2)
				),
				scale: randomV3(blobScale.min, blobScale.max),
			};
		});
	}, [camera, blobCount, blobScale]);

	const blobs = useMemo(() => {
		if (!camera) return [];
		return initialBlobs.map((blob) => {
			const s = blob.scale;
			const p = blob.position.clone();
			const visible = visibleSizeAtZ(p.z, camera);
			const maxScale = Math.max(s.x, s.y, s.z);
			const limit = v2(visible.x * 0.45, visible.y * 0.45);
			p.y =
				p.y && limit.y - maxScale > 0
					? clamp(p.y, -limit.y + maxScale, limit.y - maxScale)
					: 0;
			p.x =
				p.x && limit.x - maxScale > 0
					? clamp(p.x, -limit.x + maxScale, limit.x - maxScale)
					: 0;
			const minLimit = Math.min(limit.x, limit.y);
			return {
				position: p,
				scale:
					(p.x === 0 || p.y === 0) && minLimit - maxScale <= 0
						? s.clone().clamp(equalV3(0), equalV3(minLimit))
						: s,
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [camera, initialBlobs, aspectRatio]);

	useLayoutEffect(() => {
		if (camera) return;
		const c = new PerspectiveCamera(15, aspectRatio, 0.1, 500);
		c.position.set(0, 0, 15);
		setCamera(c);
	}, [camera, aspectRatio]);

	return (
		<ThreeScene
			ref={canvasRef}
			className={props.className || null}
			fpsLimit={10}
			shadows={false}
			dpr={dpr}
			camera={camera}
			gl={{ antialias: false }}
			onCreated={() => {
				isFn(props.onLoad) && props.onLoad();
			}}
		>
			<group>
				{blobs.map(({ position, scale }, i) => {
					return (
						<ShaderBlob
							key={`blob-${i}`}
							position={position}
							scale={scale}
							radius={1}
							updateFrequency={5000}
							randomizeFrequency={true}
						/>
					);
				})}
			</group>
		</ThreeScene>
	);
};

export default BlobScene;
