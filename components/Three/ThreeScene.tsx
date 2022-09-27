/* eslint-disable react/display-name */
import {
	Canvas,
	Props,
	RootState,
	Camera,
	CameraProps,
} from '@react-three/fiber';
import React, { useRef } from 'react';
import FrameLimiter from './FrameLimiter';
import { WebGLRendererParameters } from 'three';
import { RenderIf } from '@components/Utilities';

export type ThreeSceneProps = {
	children?: React.ReactNode;
	onCreated?: (state: RootState) => Promise<void> | void;
	fpsLimit?: number;
	shadows?: boolean;
	camera?: CameraProps | Camera;
	dpr?: number;
	gl?: WebGLRendererParameters;
	camRef?: React.MutableRefObject<Camera>;
} & React.HTMLAttributes<HTMLDivElement> &
	Props;

const defaultGL: WebGLRendererParameters = {
	antialias: false,
	powerPreference: 'low-power',
	alpha: true,
};

const ThreeScene = React.forwardRef(
	(props: ThreeSceneProps, ref: React.Ref<HTMLCanvasElement>) => {
		const { fpsLimit, shadows = true, gl, children, ...rest } = props;
		const glProps = useRef(!gl ? defaultGL : { ...defaultGL, ...gl });
		return (
			<Canvas gl={glProps.current} shadows={shadows} ref={ref} {...rest}>
				<RenderIf condition={!!fpsLimit}>
					<FrameLimiter fps={fpsLimit} />
				</RenderIf>
				{children}
			</Canvas>
		);
	}
);

export default ThreeScene;
