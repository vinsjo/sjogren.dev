import { Vector3, ShaderMaterial } from 'three';
import { minmax, type MinMax } from '@/utils/misc';
import { rand } from '@/utils/math';
import {
  v3,
  randomV3,
  uValue,
  type UniformNum,
  type UniformV3,
} from '@/utils/three';

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

export type RandomLimits = {
  [K in keyof BlobOptions]: { [U in keyof BlobOptions[K]]: MinMax };
};

export type PartialRandomLimits = Partial<{
  [K in keyof RandomLimits]: Partial<RandomLimits[K]>;
}>;

const _defaultShaderOptions = Object.freeze<BlobShaderOptions>({
  alpha: 1,
  lightThreshold: v3(0.2, 0.2, 0.2),
  frequency: v3(5, 5, 5),
  amplitude: v3(0.2, 0.2, 0.2),
  distSpeed: v3(0.05, 0.05, 0.05),
  colorMultiplier: v3(1.0, 1.0, 1.0),
});

const _defaultRandomLimits = Object.freeze<RandomLimits>({
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
});

const getDefaultShaderOptions = () => {
  return JSON.parse(JSON.stringify(_defaultShaderOptions)) as BlobShaderOptions;
};
const getDefaultRandomLimits = () => {
  return JSON.parse(JSON.stringify(_defaultRandomLimits)) as RandomLimits;
};

export function blobShader(options?: Partial<BlobShaderOptions>) {
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
  options?: Partial<BlobShaderOptions>,
): BlobUniforms {
  const {
    alpha,
    lightThreshold,
    frequency,
    amplitude,
    distSpeed,
    colorMultiplier,
  } = Object.assign(getDefaultShaderOptions(), options);

  return {
    uTime: uValue(0.0),
    uAlpha: uValue(alpha),
    uLightThreshold: uValue(lightThreshold),
    uFrequency: uValue(frequency),
    uAmplitude: uValue(amplitude),
    uDistSpeed: uValue(distSpeed),
    uColorMultiplier: uValue(colorMultiplier),
  };
}

export function getRandomOptions(
  limitOptions: PartialRandomLimits = {},
): BlobOptions {
  const shader = getDefaultShaderOptions();

  const { mesh: meshLimits, shader: shaderLimits } = getDefaultRandomLimits();

  if (limitOptions.mesh) {
    Object.assign(meshLimits, limitOptions.mesh);
  }

  if (limitOptions.shader) {
    Object.assign(shaderLimits, limitOptions.shader);
  }

  shader.alpha = rand(shaderLimits.alpha.max, shaderLimits.alpha.min);

  (
    [
      'lightThreshold',
      'frequency',
      'amplitude',
      'distSpeed',
      'colorMultiplier',
    ] satisfies ExtractKeysByType<BlobShaderOptions, Vector3>[]
  ).forEach((key) => {
    shader[key] = randomV3(shaderLimits[key].min, shaderLimits[key].max);
  });

  return {
    shader,
    mesh: {
      scale: randomV3(meshLimits.scale.min, meshLimits.scale.max),
      rotationSpeed: randomV3(
        meshLimits.rotationSpeed.min,
        meshLimits.rotationSpeed.max,
      ),
    },
  };
}
