import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const OrbitController = (options) => {
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
