const { isInt } = require('x-is-type');
const { rand_int, shuffle_arr } = require('../../misc');
const config = require('./config');
/**
 * @param {Number} row
 * @param {Number} col
 */
function getBoxMin(row, col) {
	if (row < 0 || row >= config.BOARD_SIZE) {
		row = Math.max(Math.min(row, config.BOARD_SIZE - 1), 0);
	}
	if (col < 0 || col >= config.BOARD_SIZE) {
		col = Math.max(Math.min(col, config.BOARD_SIZE - 1), 0);
	}
	return {
		row: Math.floor(row - (row % config.BOX_SIZE)),
		col: Math.floor(col - (col % config.BOX_SIZE)),
	};
}
/**
 *
 * @param {Number[][]} board
 * @param {Number} row
 * @param {Number} col
 * @param {Number} num
 */
function isSafe(board, row, col, num) {
	if (!isInt(row, col)) throw `Invalid row or col: ${col}, ${row}`;
	//Row Clash
	for (let c = 0; c < board.length; c++) {
		if (board[row][c] === num) return false;
	}
	//Column Clash
	for (let r = 0; r < board.length; r++) {
		if (board[r][col] === num) return false;
	}
	const min = getBoxMin(row, col);
	//Box Clash
	for (let r = min.row; r < min.row + config.BOX_SIZE; r++) {
		for (let c = min.col; c < min.col + config.BOX_SIZE; c++) {
			if (board[r][c] === num) return false;
		}
	}
	return true;
}
/**
 * @param {Number[][]} board
 */
function cloneBoard(board) {
	return board.map((row) => [...row]);
}

/**
 * @param {Number[][]} board
 */
function nextEmptyCell(board) {
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board.length; col++) {
			if (board[row][col] !== config.EMPTY_VALUE) continue;
			return { row, col };
		}
	}
	return false;
}

function createEmptyBoard() {
	const board = [];
	while (board.length < config.BOARD_SIZE) {
		const row = [];
		while (row.length < config.BOARD_SIZE) {
			row.push(config.EMPTY_VALUE);
		}
		board.push(row);
	}
	return board;
}

/**
 * @param {Number[][]} board
 * @param {Number} counter
 * @returns {(Number[][] | false)}
 */
function fillBoard(board, counter = 0) {
	const cell = nextEmptyCell(board);
	if (!cell) return board;
	const { row, col } = cell;
	const numbers = shuffle_arr([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	for (let i = 0; i < board.length; i++) {
		counter++;
		if (counter > config.MAX_RECURSIONS)
			throw 'Exceeded maximum recursions';
		if (!isSafe(board, row, col, numbers[i])) continue;
		let clone = cloneBoard(board);
		clone[row][col] = numbers[i];
		const filled = fillBoard(clone, counter);
		if (!filled) continue;
		return filled;
	}
	return false;
}
/**
 *
 * @param {Number[][]} board
 */
function randomCell(board) {
	const [row, col] = [rand_int(board.length), rand_int(board.length)];
	return {
		row,
		col,
		value: board[row][col],
	};
}
/**
 * @param {Number[][]} solvedBoard
 * @param {Number} [emptyCells]
 */
function unsolveBoard(solvedBoard, emptyCells = 0) {
	if (!Array.isArray(solvedBoard)) return solvedBoard;
	let unsolved = cloneBoard(solvedBoard);
	let removedCount = 0;
	while (
		removedCount < emptyCells &&
		removedCount < Math.pow(config.BOARD_SIZE, 2)
	) {
		const { row, col, value } = randomCell(unsolved);
		if (!value || value === config.EMPTY_VALUE) continue;
		const clone = cloneBoard(unsolved);
		clone[row][col] = config.EMPTY_VALUE;
		if (!fillBoard(clone)) continue;
		unsolved = clone;
		removedCount++;
	}
	return unsolved;
}

/**
 * @param {Number} [maxTries]
 * @param {Number} [tries]
 * @returns {Number[][]}
 */
function createBoard(maxTries = 5, tries = 1) {
	try {
		const empty = createEmptyBoard();
		const board = fillBoard(empty);
		if (!board) throw 'Failed creating board';
		return board;
	} catch (e) {
		if (tries < maxTries) return createBoard(tries + 1);
		throw e;
	}
}

module.exports = {
	createEmptyBoard,
	createBoard,
	unsolveBoard,
};
