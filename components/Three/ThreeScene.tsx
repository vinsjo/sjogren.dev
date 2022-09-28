/* eslint-disable react/display-name */
import {
	Canvas,
	Props as ThreeFiberProps,
	RootState,
	Camera,
	CameraProps,
} from '@react-three/fiber';
import React, { useLayoutEffect, useRef } from 'react';
import FrameLimiter from './FrameLimiter';
import { WebGLRendererParameters } from 'three';
import { RenderIf } from '@components/Utilities';
import useResizeObserver from '@hooks/useResizeObserver';
import { isFn } from 'x-is-type/callbacks';
import useDidMount from '@hooks/useDidMount';

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
	const didMount = useDidMount();
	const canvasRef = useRef<HTMLCanvasElement>();
	const canvasSize = useResizeObserver(canvasRef.current);
	useLayoutEffect(() => {
		isFn(onResize) && onResize(canvasSize);
	}, [onResize, canvasSize]);
	return (
		<Canvas
			gl={glProps.current}
			shadows={shadows}
			ref={canvasRef}
			{...props}
		>
			<RenderIf condition={!!fpsLimit}>
				<FrameLimiter fps={fpsLimit} />
			</RenderIf>
			{children}
		</Canvas>
	);
};

export default ThreeScene;
