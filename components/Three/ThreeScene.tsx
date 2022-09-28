/* eslint-disable react/display-name */
import {
	Canvas,
	Props as ThreeFiberProps,
	RootState,
	Camera,
	CameraProps,
} from '@react-three/fiber';
import React, { useLayoutEffect, useRef, useMemo } from 'react';
import FrameLimiter from './FrameLimiter';
import { WebGLRendererParameters } from 'three';
import useResizeObserver from '@hooks/useResizeObserver';
import { isFn, isNum } from 'x-is-type/callbacks';

export type ThreeSceneProps = {
	children?: React.ReactNode;
	onCreated?: (state: RootState) => Promise<void> | void;
	onResize?: (canvasSize: { width: number; height: number }) => unknown;
	fpsLimit?: number;
	shadows?: boolean;
	camera?: CameraProps | Camera;
	dpr?: number;
	gl?: WebGLRendererParameters;
	camRef?: React.MutableRefObject<Camera>;
} & React.HTMLAttributes<HTMLDivElement> &
	ThreeFiberProps;

const defaultGL: WebGLRendererParameters = {
	antialias: false,
	powerPreference: 'low-power',
	alpha: true,
};

const ThreeScene = ({
	fpsLimit,
	shadows = true,
	gl,
	children,
	onResize,
	...props
}: ThreeSceneProps) => {
	const glProps = useRef(!gl ? defaultGL : { ...defaultGL, ...gl });
	const canvasRef = useRef<HTMLCanvasElement>();
	const canvasSize = useResizeObserver(canvasRef.current);
	const fps = useMemo(
		() => (isNum(fpsLimit) && fpsLimit > 0 ? fpsLimit : 0),
		[fpsLimit]
	);
	useLayoutEffect(() => {
		isFn(onResize) && onResize(canvasSize);
	}, [onResize, canvasSize]);
	return (
		<Canvas
			gl={glProps.current}
			shadows={shadows}
			ref={canvasRef}
			frameloop={fps ? 'demand' : 'always'}
			{...props}
		>
			{fps ? <FrameLimiter fps={fps} /> : null}
			{children}
		</Canvas>
	);
};

export default ThreeScene;
