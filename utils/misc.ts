import { isArr, isNum, isObj } from 'x-is-type';

const rand_int = (max = 10, min = 0) => {
	return Math.floor(Math.random() * (max - min)) + min;
};

const shuffle_arr = <T>(arr: T[]): T[] => {
	if (!Array.isArray(arr)) return arr;
	for (let i = arr.length - 1; i > 0; i--) {
		const randomIndex = rand_int(i + 1);
		[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
	}
	return arr;
};
/**
 * ternary operator function
 * if validatorFn returns true a is returned otherwise b is returned.
 * if additional parameters are passed (inputValues),
 * they are passed to validatorFn,
 * otherwise a is passed
 */
const tern = <T1, T2>(
	a: T1,
	b: T2,
	validatorFn: (...values: any[]) => boolean,
	...inputValues: any[]
): T1 | T2 => {
	return validatorFn(...(inputValues.length > 0 ? inputValues : [a])) ? a : b;
};

const minmax = (min?: number, max?: number): { min: number; max: number } => {
	return {
		min: tern(min, 0, isNum),
		max: tern(max, 0, isNum),
	};
};

function cloneArrayRecursive(arr: any[]) {
	if (!Array.isArray(arr)) return arr;
	const clone = [...arr];
	for (let i = 0; i < clone.length; i++) {
		if (clone[i] === arr) {
			clone[i] = clone;
			continue;
		}
		if (isArr(clone[i])) {
			clone[i] = cloneArrayRecursive(clone[i]);
			continue;
		}
		if (isObj(clone[i])) {
			clone[i] = cloneObjRecursive(clone[i]);
			continue;
		}
	}
	return clone;
}

function cloneObjRecursive<T extends Object>(obj: T): T {
	if (!(obj instanceof Object)) return obj;
	const clone = { ...obj };
	for (const key of Object.keys(clone)) {
		if (clone[key] === obj) {
			clone[key] === clone;
			continue;
		}
		if (Array.isArray(clone[key])) {
			clone[key] = cloneArrayRecursive(clone[key]);
			continue;
		}
		if (clone[key] instanceof Object) {
			clone[key] = cloneObjRecursive(clone[key]);
			continue;
		}
	}
	return clone;
}

export {
	rand_int,
	shuffle_arr,
	minmax,
	tern,
	cloneArrayRecursive,
	cloneObjRecursive,
};
