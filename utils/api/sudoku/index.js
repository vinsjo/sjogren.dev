const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const { rand_int } = require('../../misc');
const safeJSON = require('safe-json-decode');

const { Worker } = require('worker_threads');
const workerPath = path.join(path.resolve(), 'utils/api/sudoku/worker.js');

const config = require('./config');

async function getBoard() {
	const files = fs.readdirSync(config.DATA_DIR);
	if (files.length >= config.STORAGE_LIMIT) {
		const file = files[rand_int(files.length)];
		const json = await fs.promises.readFile(
			path.join(config.DATA_DIR, file),
			{ encoding: 'utf-8' }
		);
		return safeJSON.decode(json);
	}
	const board = await new Promise((resolve, reject) => {
		const worker = new Worker(workerPath);
		worker.on('message', (data) => resolve(data));
		worker.on('error', (err) => reject(err));
	});
	const id = uuid.v4();
	const output = { id, ...board };
	await fs.promises.writeFile(
		path.join(config.DATA_DIR, `${id}.json`),
		safeJSON.encode(output),
		{
			encoding: 'utf-8',
		}
	);
	return output;
}

async function getStoredBoard(id) {
	const jsonPath = path.join(config.DATA_DIR, `${id}.json`);
	if (!fs.existsSync(jsonPath)) return null;
	const data = await fs.promises.readFile(jsonPath, {
		encoding: 'utf-8',
	});
	return safeJSON.decode(data);
}

module.exports = {
	getBoard,
	getStoredBoard,
	config,
};
