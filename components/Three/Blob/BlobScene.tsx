import React, {
	useState,
	useMemo,
	useRef,
	useCallback,
	forwardRef,
} from 'react';
import { EffectComposer, Noise } from '@react-three/postprocessing';
import useWindowSize from '../../../hooks/useWindowSize';
import ShaderBlob from './ShaderBlob';
import ThreeScene from '../ThreeScene';
import styles from './BlobScene.module.css';
import { isEqualObj } from 'x-is-equal';
import { classNames } from '@utils/client';

const BlobScene = ({
	onLoad,
	className,
	...props
}: {
	onLoad?: () => Promise<unknown> | unknown;
	className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
	const canvasRef: React.MutableRefObject<HTMLCanvasElement | undefined> =
		useRef();
	const [loaded, setLoaded] = useState(false);
	const [canvasRect, setCanvasRect] = useState(null);

	const dpr = useMemo(() => {
		if (!window) return 0.5;
		return window.devicePixelRatio * 0.25;
	}, []);

	const handleResize = useCallback(() => {
		if (!canvasRef.current || !loaded) return;
		const rect = canvasRef.current.getBoundingClientRect();
		if (isEqualObj(canvasRect, rect)) return;
		setCanvasRect(rect);
	}, [canvasRef, loaded, canvasRect, setCanvasRect]);

	const canvasRatio = useMemo(() => {
		if (!canvasRect) return 0.5625;
		const { width, height } = canvasRect;
		return Math.min(width, height) / Math.max(width, height);
	}, [canvasRect]);

	const camFOV = useMemo(() => {
		return 2 * canvasRatio;
	}, [canvasRatio]);

	useWindowSize(handleResize);

	return (
		<div
			className={classNames(styles.container, className || null)}
			{...props}
		>
			<ThreeScene
				ref={canvasRef}
				className={classNames(
					styles.canvas,
					loaded ? styles.loaded : null
				)}
				fpsLimit={30}
				shadows={false}
				dpr={dpr}
				camera={{
					fov: camFOV,
					near: 0.1,
					far: 500,
					position: [0, 0, 15],
				}}
				onCreated={() => {
					setLoaded(true);
					typeof onLoad === 'function' && onLoad();
				}}
			>
				<EffectComposer>
					<Noise opacity={0.02} />
				</EffectComposer>

				<ShaderBlob />
			</ThreeScene>
		</div>
	);
};

export default BlobScene;
