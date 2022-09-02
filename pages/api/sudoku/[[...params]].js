const { PORT, ADDRESS } = process.env;
const { isStr } = require('x-is-type');
const fs = require('fs');
const path = require('path');
const sudoku = require('../../../utils/api/sudoku');

const getLevels = () => {
	const levels = { ...sudoku.config.LEVELS };
	for (const key of Object.keys(levels)) {
		levels[key] = `${levels[key]} empty cells`;
	}
	return levels;
};

/**
 * @param {import('next').NextApiRequest} req
 */
const getParams = (req) => req.query.params || [];

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
	const params = getParams(req);
	if (!params[0]) {
		return res.status(200).json({
			endpoints: ['/get', '/get/:id'],
		});
	}
	if (params[0] === 'get') {
		const id = params[1];
		if (!id) {
			const board = await sudoku.getBoard();
			return res.status(200).json(board);
		}
		const board = await sudoku.getStoredBoard(id);
		if (!board) {
			return res
				.status(404)
				.json({ error: `File with id: '${id}' not found` });
		}
		return res.status(200).json(board);
	}
	res.status(404).end();
}
