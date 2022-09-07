import { useState, useRef, useMemo, MutableRefObject } from 'react';
import { SphereGeometry, Vector3, ShaderMaterial, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { randomV3, isV3, v3 } from '@utils/client/three';
import { tern, minmax } from '@utils/misc';
import { isNum, isObj } from 'x-is-type';
import type { BlobOptions } from '@utils/client/three/shaders/blob';
import { blobShader, getRandomOptions } from '@utils/client/three/shaders/blob';

const ShaderBlob = () => {
	const mesh: MutableRefObject<undefined | Mesh> = useRef();
	const [options, setOptions] = useState(getRandomOptions);
	const material = useMemo(() => blobShader(options.shader), [options]);
	const [pointer, setPointer] = useState({
		down: false,
		grab: false,
	});

	useFrame(() => {
		if (!mesh.current) return;
		const speed = options.mesh.rotationSpeed;
		mesh.current.rotation.x += speed.x;
		mesh.current.rotation.y += speed.y;
		mesh.current.rotation.z += speed.z;
		const mat = mesh.current.material as ShaderMaterial;
		mat.uniforms.uTime.value += 0.1;
	});

	return (
		<mesh
			onPointerDown={() => {
				setPointer({ ...pointer, down: true });
			}}
			onPointerMove={() => {
				const down = pointer.down;
				setPointer({ down, grab: down });
			}}
			onPointerUp={() => {
				if (!pointer.grab) setOptions(getRandomOptions());
				setPointer({ down: false, grab: false });
			}}
			ref={mesh}
			scale={options.mesh.scale}
			geometry={new SphereGeometry(1, 64, 32)}
			material={material}
		/>
	);
};

export default ShaderBlob;
