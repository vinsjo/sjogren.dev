import { MathUtils, PerspectiveCamera, Vector2, Vector3 } from 'three';
import { isNum } from 'x-is-type';
import { isObj } from 'x-is-type/callbacks';
import { rand, WH } from '@utils/misc';

export type UniformV3 = {
    value: Vector3;
};
export type UniformNum = {
    value: number;
};

export type V3 = Vector3 | { x: number; y: number; z: number };
export type V2 = Vector2 | { x: number; y: number };
/** Create Vector3 */
export function v3(x?: number, y?: number, z?: number) {
    return new Vector3(x, y, z);
}
/** Create Vector2 */
export function v2(x?: number, y?: number) {
    return new Vector2(x, y);
}
/** Check if variable is a valid 2d vector */
export function isV2<T = unknown>(v?: T) {
    return (!!v &&
        (v instanceof Vector2 ||
            (isObj(v) && isNum(v['x'], v['y'])))) as typeof v extends V2
        ? true
        : false;
}
/** Create Vector3 with equal x, y and z values */
export function equalV3(xyz?: number) {
    return v3(xyz, xyz, xyz);
}
/** Check if variable is a valid 3d vector */
export function isV3<T = unknown>(v?: T) {
    return (!!v &&
        (v instanceof Vector3 ||
            (isObj(v) && isNum(v['x'], v['y'], v['z'])))) as typeof v extends V3
        ? true
        : false;
}

export function maxV3(v: V3) {
    return !isV3(v) ? 0 : Math.max(v.x, v.y, v.z);
}
export function minV3(v: V3) {
    return !isV3(v) ? 0 : Math.min(v.x, v.y, v.z);
}

/** Create Vector3 with random x, y and z values, between min and max */
export function randomV3(min = 0, max = 1) {
    const [x, y, z] = [...Array(3)].map(() => rand(max, min));
    return v3(x, y, z);
}

export function uValue<T>(value: T): { value: T } {
    return { value };
}
/**
 * source: https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
 */
export function visibleSizeAtZ(z: number, camera: PerspectiveCamera) {
    const camZ = camera.position.z;
    // compensate for cameras not positioned at z=0
    const depth = z < camZ ? z - camZ : z + camZ;
    // vertical fov in radians
    const vFOV = !camera.fov ? 0 : (camera.fov * Math.PI) / 180;
    // Math.abs to ensure the result is always positive
    const height = !vFOV ? 0 : 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    return v2(height * camera.aspect, height);
}

export function updateAspect(camera: PerspectiveCamera, canvasSize: WH) {
    const { width, height } = canvasSize;
    if (!width || !height) return camera.aspect;
    const aspect = width / height;
    if (camera.aspect !== aspect) camera.aspect = aspect;
    return aspect;
}
