import { ShaderMaterial } from 'three';
import type { BlobShaderOptions } from '../types';
import { initBlobShaderUniforms } from './initBlobShaderUniforms';
import { blobFragmentShader, blobVertexShader } from '../constants';

export const createBlobShaderMaterial = (
  options?: Partial<BlobShaderOptions>,
): ShaderMaterial => {
  return new ShaderMaterial({
    uniforms: initBlobShaderUniforms(options),
    vertexShader: blobVertexShader,
    fragmentShader: blobFragmentShader,
  });
};
