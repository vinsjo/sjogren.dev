import { MathUtils, Vector3 } from 'three';
import { isObj, isNum } from 'x-is-type';

/**
 * Check if variable is a valid 3d vector
 *
 * @function isVector3
 * @param  {any} val  the variable to be examined
 * @return {Boolean}  returns true if:
 * variable is an object,
 * has "x", "y" and "z" properties and
 * and their values is of type "number"
 */
export function isV3(val) {
	return isObj(val) && isNum(val.x, val.y, val.z);
}
/**
 *
 * @param {import('three').Vector3} v
 * @param {Number} min
 * @param {Number} max
 */
export function clampV3(v, min = 0, max = 1) {
	v.x = MathUtils.clamp(v.x, min, max) + 0.0;
	v.y = MathUtils.clamp(v.y, min, max) + 0.0;
	v.z = MathUtils.clamp(v.z, min, max) + 0.0;
	return v;
}

export function randomV3(min = 0, max = 1) {
	const v = new Vector3(Math.random(), Math.random(), Math.random());
	if (min !== 0 || max !== 1) {
		v.x = MathUtils.mapLinear(v.x, 0, 1, min, max);
		v.y = MathUtils.mapLinear(v.y, 0, 1, min, max);
		v.z = MathUtils.mapLinear(v.z, 0, 1, min, max);
		return clampV3(v, min, max);
	}
	return v;
}
