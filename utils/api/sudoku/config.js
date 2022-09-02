const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(path.resolve(), 'data/sudoku');

if (!fs.existsSync(DATA_DIR)) {
	fs.mkdirSync(DATA_DIR, { recursive: true });
}

const BOARD_SIZE = 9;
const BOARD_CELLS = 9 * 9;
const BOX_SIZE = 3;

const EMPTY_VALUE = 0;
const MAX_RECURSIONS = 2000;

const LEVELS = {
	easy: 27,
	medium: 38,
	hard: 43,
	master: 52,
};

const STORAGE_LIMIT = 2000;

module.exports = {
	DATA_DIR,
	BOARD_SIZE,
	BOARD_CELLS,
	BOX_SIZE,
	EMPTY_VALUE,
	MAX_RECURSIONS,
	LEVELS,
	STORAGE_LIMIT,
};
