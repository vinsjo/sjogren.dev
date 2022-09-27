import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { SphereGeometry, ShaderMaterial, Mesh, Vector } from 'three';
import { MeshProps, useFrame } from '@react-three/fiber';
import { isMinMax, MinMax, minmax } from '@utils/misc';
import { isNum } from 'x-is-type/callbacks';
import { blobShader, getRandomOptions } from '@utils/client/three/shaders/blob';
import { Vector3 } from 'three';
export type ShaderBlobProps = MeshProps & {
	scale?: Vector3;
	radius?: number;
	widthSegments?: number;
	heightSegments?: number;
	updateFrequency?: number;
	randomizeFrequency?: boolean;
};

const ShaderBlob = ({
	updateFrequency,
	randomizeFrequency,
	radius,
	widthSegments,
	heightSegments,
	scale,
	...meshProps
}: ShaderBlobProps) => {
	const sphere = useRef(
		new SphereGeometry(
			isNum(radius) ? radius : 1,
			isNum(widthSegments) ? widthSegments : 64,
			isNum(heightSegments) ? heightSegments : 32
		)
	);

	const mesh = useRef<Mesh>();
	const [options, setOptions] = useState(getRandomOptions());
	const material = useMemo(
		() => blobShader(options.shader),
		[options.shader]
	);

	useFrame(() => {
		if (!mesh.current) return;
		const { rotationSpeed } = options.mesh;
		for (const key of ['x', 'y', 'z']) {
			mesh.current.rotation[key] = rotationSpeed[key];
		}
		const { uniforms } = mesh.current.material as ShaderMaterial;
		uniforms.uTime.value += 0.1;
	});

	useEffect(() => {
		if (!updateFrequency || !isNum(updateFrequency)) return;
		const timeout = setTimeout(
			() => {
				setOptions(getRandomOptions());
			},
			randomizeFrequency
				? Math.round(Math.random() * updateFrequency)
				: updateFrequency
		);
		return () => clearTimeout(timeout);
	}, [updateFrequency, randomizeFrequency, options, setOptions]);

	return (
		<mesh
			ref={mesh}
			scale={scale || options.mesh.scale}
			geometry={sphere.current}
			material={material}
			onClick={(e) => {
				e.stopPropagation();
				setOptions(getRandomOptions());
			}}
			{...meshProps}
		/>
	);
};

ShaderBlob.defaultProps = {
	radius: 1,
	widthSegments: 64,
	heightSegments: 32,
};

export default ShaderBlob;
