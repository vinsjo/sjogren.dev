const { PORT, ADDRESS } = process.env;
const { isStr } = require('x-is-type');
const fs = require('fs');
const path = require('path');
const sudoku = require('../../../utils/api/sudoku');

export default async function handler(req, res) {
	const { params = [] } = req.query;
	if (!params.length) {
		const levels = { ...sudoku.config.LEVELS };
		for (const key of Object.keys(levels)) {
			levels[key] = `${levels[key]} empty cells`;
		}
		return res.status(200).json({ levels });
	}
	if (params[0] === 'create') {
		let level = params[1];

		if (!isStr(level) || sudoku.config.LEVELS[level] === undefined) {
			level = Object.keys(sudoku.config.LEVELS)[0];
		}
		const board = await sudoku.getBoard();
		return res.status(201).json(board);
	}
	if (params[0] === 'get') {
		const id = params[1];
		const jsonPath = path.join(sudoku.DATA_DIR, `${id}.json`);
		if (!fs.existsSync(jsonPath)) {
			return res.status(404).json({ error: 'File not found' });
		}
		const data = await fs.promises.readFile(jsonPath, {
			encoding: 'utf-8',
		});
		return res.status(200).json(data);
	}
	res.status(404);
}
