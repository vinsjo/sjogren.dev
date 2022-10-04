import { getBoard, getStoredBoard } from '../../../utils/api/sudoku';
import cors from 'cors';
import { getParams, runMiddleWare } from '../../../utils/api';

import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

const handler: NextApiHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    await runMiddleWare(
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
            const board = await getBoard();
            return res.status(200).json(board);
        }
        const board = await getStoredBoard(id);
        if (!board) {
            return res
                .status(404)
                .json({ error: `File with id: '${id}' not found` });
        }
        return res.status(200).json(board);
    }
    res.status(404).end();
};

export default handler;
