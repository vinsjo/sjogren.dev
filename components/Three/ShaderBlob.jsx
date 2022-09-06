import { useState, useRef, useMemo } from 'react';
import { SphereGeometry, Vector3, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { randomV3, isV3 } from '../../utils/client/three';

const DEFAULT_OPTIONS = {
	alpha: 1.0,
	lightThreshold: new Vector3(0.2, 0.2, 0.2),
	frequency: new Vector3(5, 5, 5),
	amplitude: new Vector3(0.2, 0.2, 0.2),
	distSpeed: new Vector3(0.05, 0.05, 0.05),
	colorMultiplier: new Vector3(1.0, 1.0, 1.0),
};

function blobShader(options) {
	const opt = options ? options : DEFAULT_OPTIONS;
	const fragmentShader = `
	precision mediump float;

	uniform float uAlpha;
	uniform vec3 uLightThreshold;
	uniform vec3 uColorMultiplier;
	uniform float uTime;
	varying vec3 vNormal;

	void main() {
		vec3 lThreshold = vec3(
			1.0 - uLightThreshold.x,
			1.0 - uLightThreshold.y,
			1.0 - uLightThreshold.z
		);

		vec3 color = vec3(       
			uColorMultiplier.x * (vNormal.x * uLightThreshold.x + lThreshold.x),
			uColorMultiplier.y * (vNormal.y * uLightThreshold.y + lThreshold.y),
			uColorMultiplier.z * (vNormal.z * uLightThreshold.z + lThreshold.z)
		);
	
		gl_FragColor = vec4(color, uAlpha);
	}`;
	const vertexShader = `
			precision mediump float;
	
			uniform float uTime;
			uniform vec3 uFrequency;
			uniform vec3 uAmplitude;
			uniform vec3 uDistSpeed;
	
			varying vec3 vNormal;
		
			void main() {
				vec4 positionVec4 = vec4(position, 1.0);
		
				vec3 distortion = vec3(
					sin(positionVec4.x * uFrequency.x + uTime * uDistSpeed.x),
					sin(positionVec4.y * uFrequency.y + uTime * uDistSpeed.y),
					sin(positionVec4.z * uFrequency.z + uTime * uDistSpeed.z)
				);
		
				positionVec4.x += distortion.x * normal.x * uAmplitude.x;
				positionVec4.y += distortion.y * normal.y * uAmplitude.y;
				positionVec4.z += distortion.z * normal.z * uAmplitude.z;
		
				gl_Position = projectionMatrix * modelViewMatrix * positionVec4;
		
				vNormal = normal;
			}`;
	return new ShaderMaterial({
		uniforms: uniforms(opt),
		vertexShader,
		fragmentShader,
	});
}

function uniforms(options) {
	const opt = options ? { ...options } : { ...DEFAULT_OPTIONS };
	return {
		uTime: {
			value: opt.time ? opt.time : 0.0,
		},
		uAlpha: {
			value: opt.alpha ? opt.alpha : DEFAULT_OPTIONS.alpha,
		},
		uLightThreshold: {
			value: isV3(opt.lightThreshold)
				? opt.lightThreshold
				: DEFAULT_OPTIONS.lightThreshold,
		},
		uFrequency: {
			value: isV3(opt.frequency)
				? opt.frequency
				: DEFAULT_OPTIONS.frequency,
		},
		uAmplitude: {
			value: isV3(opt.amplitude)
				? opt.amplitude
				: DEFAULT_OPTIONS.amplitude,
		},
		uDistSpeed: {
			value: isV3(opt.distSpeed)
				? opt.distSpeed
				: DEFAULT_OPTIONS.distSpeed,
		},
		uColorMultiplier: {
			value: isV3(opt.colorMultiplier)
				? opt.colorMultiplier
				: DEFAULT_OPTIONS.colorMultiplier,
		},
	};
}

const randomLimits = {
	scale: {
		min: 1,
		max: 1,
	},
	colorMultiplier: {
		min: 0.05,
		max: 0.7,
	},
	lightThreshold: {
		min: 0.1,
		max: 0.5,
	},
	frequency: {
		min: 1,
		max: 5,
	},
	amplitude: {
		min: 0.05,
		max: 0.25,
	},
	distortionSpeed: {
		min: 0.005,
		max: 0.05,
	},
	rotationSpeed: {
		min: -0.01,
		max: 0.01,
	},
};

const getRandomOptions = () => {
	const {
		scale,
		rotationSpeed,
		colorMultiplier,
		lightThreshold,
		frequency,
		amplitude,
		distortionSpeed,
	} = randomLimits;
	return {
		mesh: {
			scale: randomV3(scale.min, scale.max),
			rotationSpeed: randomV3(rotationSpeed.min, rotationSpeed.max),
		},
		shader: {
			colorMultiplier: randomV3(colorMultiplier.min, colorMultiplier.max),
			lightThreshold: randomV3(lightThreshold.min, lightThreshold.max),
			frequency: randomV3(frequency.min, frequency.max),
			amplitude: randomV3(amplitude.min, amplitude.max),
			distortionSpeed: randomV3(distortionSpeed.min, distortionSpeed.max),
		},
	};
};

const ShaderBlob = () => {
	const mesh = useRef();
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
		const { uniforms } = mesh.current.material;
		uniforms.uTime.value += 0.1;
	});

	return (
		<mesh
			onPointerDown={() => {
				setPointer({ ...pointer, down: true });
			}}
			onPointerMove={(e) => {
				const down = pointer.down || e.pressure;
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
