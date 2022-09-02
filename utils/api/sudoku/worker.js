const { parentPort } = require('worker_threads');
const { createBoard, unsolveBoard } = require('./functions');
const { LEVELS } = require('./config');

const solution = createBoard();
const unsolved = {};

Object.entries(LEVELS).forEach(([level, emptyCells]) => {
	unsolved[level] = unsolveBoard(solution, emptyCells);
});

parentPort.postMessage({ solution, unsolved });
