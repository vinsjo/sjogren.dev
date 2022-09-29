/* eslint-disable react/display-name */
import { Canvas, Props, RootState } from '@react-three/fiber';
import React, { useRef } from 'react';
import FPSLimiter from './FPSLimiter';
import { WebGLRendererParameters } from 'three';

export type ThreeSceneProps = {
	children?: React.ReactNode;
	fpsLimit?: number;
	shadows?: boolean;
	dpr?: number;
	gl?: WebGLRendererParameters;
} & React.HTMLAttributes<HTMLDivElement> &
	Props;

const defaultGL: WebGLRendererParameters = {
	antialias: false,
	powerPreference: 'low-power',
	alpha: true,
};

const ThreeScene = ({
	fpsLimit,
	shadows = false,
	gl,
	children,
	...props
}: ThreeSceneProps) => {
	const glProps = useRef(!gl ? defaultGL : { ...defaultGL, ...gl });
	return (
		<Canvas gl={glProps.current} shadows={shadows} {...props}>
			<FPSLimiter limit={fpsLimit} />
			{children}
		</Canvas>
	);
};

export default ThreeScene;
