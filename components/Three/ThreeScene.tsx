/* eslint-disable react/display-name */
import { Canvas, Props, RootState } from '@react-three/fiber';
import React from 'react';
import { isFn } from 'x-is-type';
import FrameLimiter from './FrameLimiter';
import { WebGLRendererParameters } from 'three';
import { RenderIf } from '@components/Utilities';

export type cameraProps = {
	fov?: number;
	near?: number;
	far?: number;
	position?: [number, number, number];
};
export type ThreeSceneProps = {
	children?: React.ReactNode;
	onCreated?: (state: RootState) => Promise<void> | void;
	fpsLimit?: number;
	shadows?: boolean;
	camera?: cameraProps;
	dpr?: number;
	gl?: WebGLRendererParameters;
};

const defaultGL: WebGLRendererParameters = {
	antialias: false,
	powerPreference: 'low-power',
	alpha: true,
};

const ThreeScene = React.forwardRef(
	(
		props: ThreeSceneProps & React.HTMLAttributes<HTMLDivElement> & Props,
		ref: React.Ref<HTMLCanvasElement>
	) => {
		const {
			fpsLimit,
			shadows = true,
			gl,
			children,
			onCreated,
			...rest
		} = props;
		return (
			<Canvas
				onCreated={(state) => isFn(onCreated) && onCreated(state)}
				gl={!gl ? defaultGL : { ...defaultGL, ...gl }}
				shadows={shadows}
				ref={ref}
				{...rest}
			>
				<RenderIf condition={!!fpsLimit}>
					<FrameLimiter fps={fpsLimit} />
				</RenderIf>
				{children}
			</Canvas>
		);
	}
);

export default ThreeScene;
