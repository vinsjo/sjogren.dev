/**
 * @param {Number} max
 * @param {Number} min
 */
function rand_int(max = 10, min = 0) {
	return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * @param {Array} arr
 */
function shuffle_arr(arr) {
	if (!Array.isArray(arr)) return arr;
	for (let i = arr.length - 1; i > 0; i--) {
		const randomIndex = rand_int(i + 1);
		[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
	}
	return arr;
}

module.exports = { rand_int, shuffle_arr };
