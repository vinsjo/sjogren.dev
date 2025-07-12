export const blobFragmentShader = `
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
export const blobVertexShader = `
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
