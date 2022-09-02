const sudoku = require('../../../utils/api/sudoku');
const cors = require('cors');
/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 * @param {function} middleware
 */
function runMiddleware(req, res, middleware) {
	return new Promise((resolve, reject) => {
		middleware(req, res, (result) =>
			result instanceof Error ? reject(result) : resolve(result)
		);
	});
}

/**
 * @param {import('next').NextApiRequest} req
 */
const getParams = (req) => req.query.params || [];

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
	await runMiddleware(
		req,
		res,
		cors({ methods: ['GET', 'HEAD'], origin: '*' })
	);
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
