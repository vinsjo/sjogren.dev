import { useState, useMemo, useRef, useCallback } from 'react';
import { EffectComposer, Noise } from '@react-three/postprocessing';
import { classNames } from '../../utils/client';
import useWindowSize from '../../hooks/useWindowSize';
import ShaderBlob from './ShaderBlob';
import ThreeScene from './ThreeScene';
import styles from './BlobScene.module.css';

const BlobScene = () => {
	const canvasRef = useRef();
	const [loaded, setLoaded] = useState(false);
	const [canvasSize, setCanvasSize] = useState(null);

	const handleResize = useCallback(() => {
		if (!canvasRef.current || !loaded) return;
		const { width, height } = canvasRef.current.getBoundingClientRect();
		setCanvasSize({ width, height });
	}, [canvasRef, loaded, setCanvasSize]);

	const canvasRatio = useMemo(() => {
		if (!canvasSize) return 0.5625;
		const { width, height } = canvasSize;
		return Math.min(width, height) / Math.max(width, height);
	}, [canvasSize]);

	const camFOV = useMemo(() => {
		return 2 * canvasRatio;
	}, [canvasRatio]);

	useWindowSize(handleResize);

	return (
		<div
			className={classNames(
				styles.container,
				loaded ? styles.show : null
			)}
		>
			<div className={styles.cover}>
				<h1 className={styles.caption}>
					<a
						href="mailto:vincent@sjogren.dev"
						target="_blank"
						title="Contact Me"
						rel="noreferrer"
					>
						vincent@sjogren.dev
					</a>
				</h1>
			</div>

			<ThreeScene
				ref={canvasRef}
				className={styles.canvas}
				shadows={false}
				dpr={window.devicePixelRatio * 0.25}
				camera={{
					fov: camFOV,
					near: 0.1,
					far: 500,
					position: [0, 0, 15],
				}}
				onLoad={() => setLoaded(true)}
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
