import { Vector3, ShaderMaterial } from 'three';
import { isNum, isObj } from 'x-is-type';
import { tern, minmax, cloneObjRecursive } from '@utils/misc';
import type { UniformNum, UniformV3 } from '../types';
import { v3, isV3, randomV3, uValue } from '..';

export type BlobShaderOptions = {
	lightThreshold: Vector3;
	frequency: Vector3;
	amplitude: Vector3;
	distSpeed: Vector3;
	colorMultiplier: Vector3;
};

export type BlobUniforms = {
	uTime: UniformNum;
	uAlpha: UniformNum;
	uLightThreshold: UniformV3;
	uFrequency: UniformV3;
	uAmplitude: UniformV3;
	uDistSpeed: UniformV3;
	uColorMultiplier: UniformV3;
};

export type BlobMeshOptions = {
	scale: Vector3;
	rotationSpeed: Vector3;
};

export type BlobOptions = {
	mesh: BlobMeshOptions;
	shader: BlobShaderOptions;
};

export const DEFAULT_OPTIONS: BlobShaderOptions = {
	lightThreshold: v3(0.2, 0.2, 0.2),
	frequency: v3(5, 5, 5),
	amplitude: v3(0.2, 0.2, 0.2),
	distSpeed: v3(0.05, 0.05, 0.05),
	colorMultiplier: v3(1.0, 1.0, 1.0),
};

export const randomLimits = {
	mesh: {
		scale: minmax(1, 1),
		rotationSpeed: minmax(-0.01, 0.01),
	},
	shader: {
		colorMultiplier: minmax(0.05, 0.7),
		lightThreshold: minmax(0.1, 0.5),
		frequency: minmax(1, 5),
		amplitude: minmax(0.05, 0.25),
		distSpeed: minmax(0.005, 0.05),
	},
};

export function blobShader(options?: BlobShaderOptions | undefined) {
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
		uniforms: uniforms(options),
		vertexShader,
		fragmentShader,
	});
}

export function uniforms(options: BlobShaderOptions | undefined): BlobUniforms {
	let { lightThreshold, ...opt } = { ...DEFAULT_OPTIONS };
	if (isObj(options)) {
		lightThreshold = tern(options.lightThreshold, lightThreshold, isNum);
		Object.keys(opt).forEach((key) => {
			opt[key] = tern(options[key], opt[key], isV3);
		});
	}
	return {
		uTime: uValue(0.0),
		uAlpha: uValue(1.0),
		uLightThreshold: uValue(lightThreshold),
		uFrequency: uValue(opt.frequency),
		uAmplitude: uValue(opt.amplitude),
		uDistSpeed: uValue(opt.distSpeed),
		uColorMultiplier: uValue(opt.colorMultiplier),
	};
}

export function getRandomOptions(): BlobOptions {
	return Object.entries(randomLimits).reduce((output, [key, section]) => {
		return {
			...output,
			[key]: Object.keys(section).reduce((output, key) => {
				return {
					...output,
					[key]: randomV3(section[key].min, section[key].max),
				};
			}, {}),
		};
	}, {}) as BlobOptions;
}
