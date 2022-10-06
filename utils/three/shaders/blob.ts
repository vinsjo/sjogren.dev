import { Vector3, ShaderMaterial } from 'three';
import { isObj, isNum } from 'x-is-type/callbacks';
import { minmax, isMinMax, cloneObjRecursive, rand, MinMax } from '@utils/misc';
import { v3, isV3, randomV3, uValue, UniformNum, UniformV3 } from '..';

export type BlobShaderOptions = {
    alpha: number;
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

export type RandomLimitsMesh = {
    scale?: MinMax;
    rotationSpeed?: MinMax;
};
export type RandomLimitsShader = {
    alpha?: MinMax;
    colorMultiplier?: MinMax;
    lightThreshold?: MinMax;
    frequency?: MinMax;
    amplitude?: MinMax;
    distSpeed?: MinMax;
};

export type RandomLimits = {
    mesh?: RandomLimitsMesh;
    shader?: RandomLimitsShader;
};

export const DEFAULT_OPTIONS: BlobShaderOptions = {
    alpha: 1,
    lightThreshold: v3(0.2, 0.2, 0.2),
    frequency: v3(5, 5, 5),
    amplitude: v3(0.2, 0.2, 0.2),
    distSpeed: v3(0.05, 0.05, 0.05),
    colorMultiplier: v3(1.0, 1.0, 1.0),
};

export const DEFAULT_RAND_LIMITS: RandomLimits = {
    mesh: {
        scale: minmax(0.9, 1.1),
        rotationSpeed: minmax(-0.005, 0.005),
    },
    shader: {
        alpha: minmax(1, 1),
        colorMultiplier: minmax(0.4, 1),
        lightThreshold: minmax(0.05, 0.25),
        frequency: minmax(0.5, 3),
        amplitude: minmax(0.05, 0.3),
        distSpeed: minmax(0.01, 0.2),
    },
};

export function blobShader(options?: BlobShaderOptions | undefined) {
    const uniforms = initUniforms(options);
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
        uniforms,
        vertexShader,
        fragmentShader,
    });
}

export function initUniforms(
    options: BlobShaderOptions | undefined
): BlobUniforms {
    const opt = cloneObjRecursive(DEFAULT_OPTIONS);
    if (isObj(options)) {
        if (isNum(options['alpha'])) opt.alpha = options['alpha'];
        Object.keys(opt).forEach((key) => {
            if (!isV3(options[key])) return;
            opt[key] = options[key];
        });
    }
    return {
        uTime: uValue(0.0),
        uAlpha: uValue(opt.alpha),
        uLightThreshold: uValue(opt.lightThreshold),
        uFrequency: uValue(opt.frequency),
        uAmplitude: uValue(opt.amplitude),
        uDistSpeed: uValue(opt.distSpeed),
        uColorMultiplier: uValue(opt.colorMultiplier),
    };
}

export function getRandomOptions(randomLimits?: RandomLimits): BlobOptions {
    const limits = cloneObjRecursive(DEFAULT_RAND_LIMITS);
    if (isObj(randomLimits)) {
        Object.keys(limits).forEach((key) => {
            if (!isObj(randomLimits[key])) return;
            const section = randomLimits[key];
            Object.keys(limits[key]).forEach((secKey) => {
                if (!isMinMax(section[secKey])) return;
                limits[key][secKey] = section[secKey];
            });
        });
    }
    return Object.entries(limits).reduce((output, [key, section]) => {
        return {
            ...output,
            [key]: Object.keys(section).reduce((output, secKey) => {
                return {
                    ...output,
                    [secKey]: isNum(DEFAULT_OPTIONS[secKey])
                        ? rand(section[secKey].max, section[secKey].min)
                        : randomV3(section[secKey].min, section[secKey].max),
                };
            }, {}),
        };
    }, {}) as BlobOptions;
}
