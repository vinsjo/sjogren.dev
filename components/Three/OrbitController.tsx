import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export type OrbitControllerOptions = {
	autoRotate?: boolean;
	autoRotateSpeed?: boolean;
	dampingFactor?: number;
	domElement?: HTMLElement;
	enabled?: boolean;
	enableDamping?: boolean;
	enablePan?: boolean;
	enableRotate?: boolean;
	enableZoom?: boolean;
	keyPanSpeed?: number;
	keys?: {
		LEFT: string;
		UP: string;
		RIGHT: string;
		BOTTOM: string;
	};
	maxAzimuthAngle?: number;
	maxDistance?: number;
	maxPolarAngle?: number;
	maxZoom?: number;
	minAzimuthAngle?: number;
	minDistance?: number;
	minPolarAngle?: number;
	minZoom?: number;
};

const OrbitController = (props: { options: OrbitControllerOptions }) => {
	const { options } = props;
	const { camera, gl } = useThree();

	useEffect(() => {
		const controls = new OrbitControls(camera, gl.domElement);
		Object.entries(options).forEach(([key, value]) => {
			if (controls[key] === undefined) return;
			controls[key] = value;
		});
		return () => controls.dispose();
	}, [options, camera, gl]);

	return null;
};

export default OrbitController;
