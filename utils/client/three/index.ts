import { MathUtils, Vector3 } from 'three';
import { isObj, isNum } from 'x-is-type';

/** Create Vector3 */
export function v3(x?: number, y?: number, z?: number) {
	return new Vector3(x, y, z);
}
/** Create Vector3 with equal x, y and z values */
export function equalV3(xyz?: number) {
	return v3(xyz, xyz, xyz);
}
/** Check if variable is a valid 3d vector */
export function isV3(v: Vector3 | any) {
	return (v?.isVector3 || isObj(v)) && isNum(v?.x, v?.y, v?.z);
}
/** Create Vector3 with random x, y and z values, between min and max */
export function randomV3(min = 0, max = 1) {
	const v = new Vector3(Math.random(), Math.random(), Math.random());
	if (min === 0 && max === 1) return v;
	['x', 'y', 'z'].forEach((axis) => {
		v[axis] = MathUtils.mapLinear(v[axis], 0, 1, min, max);
	});
	return v.clamp(equalV3(min), equalV3(max));
}

export function uValue<T>(value: T): { value: T } {
	return { value };
}
