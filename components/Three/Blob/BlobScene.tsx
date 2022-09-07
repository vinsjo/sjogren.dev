import React, { useState, useMemo, useRef, useCallback } from 'react';
import { EffectComposer, Noise } from '@react-three/postprocessing';
import useWindowSize from '../../../hooks/useWindowSize';
import ShaderBlob from './ShaderBlob';
import ThreeScene from '../ThreeScene';
import styles from './BlobScene.module.css';
import useDidMount from '../../../hooks/useDidMount';
import { isEqualObj } from 'x-is-equal';
import { classNames } from '@utils/client';

const BlobScene = (props: {
	children?: React.ReactNode;
	onLoad?: () => unknown | void;
}) => {
	const didMount = useDidMount();
	const canvasRef: React.MutableRefObject<HTMLCanvasElement | undefined> =
		useRef();
	const [loaded, setLoaded] = useState(false);
	const [canvasRect, setCanvasRect] = useState(null);

	const dpr = useMemo(() => {
		if (!didMount || !window) return 0.5;
		return window.devicePixelRatio * 0.25;
	}, [didMount]);

	const handleResize = useCallback(() => {
		if (!didMount || !canvasRef.current || !loaded) return;
		const rect = canvasRef.current.getBoundingClientRect();
		if (isEqualObj(canvasRect, rect)) return;
		setCanvasRect(rect);
	}, [didMount, canvasRef, loaded, canvasRect, setCanvasRect]);

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
			className={classNames(
				styles.container,
				loaded ? styles.show : null
			)}
		>
			{!props.children ? null : (
				<div className={styles.cover}>{props.children}</div>
			)}

			<ThreeScene
				ref={canvasRef}
				className={styles.canvas}
				shadows={false}
				dpr={dpr}
				camera={{
					fov: camFOV,
					near: 0.1,
					far: 500,
					position: [0, 0, 15],
				}}
				onLoad={() => {
					setLoaded(true);
					typeof props.onLoad === 'function' && props.onLoad();
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
