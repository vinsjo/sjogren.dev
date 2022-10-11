import cors from 'cors';
import { getApiResponse, getStoredBoard } from '@utils/api/sudoku';
import { getParams, runMiddleWare, jsonErrorResponse } from '@utils/api';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

const handler: NextApiHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        await runMiddleWare(
            req,
            res,
            cors({ methods: ['GET', 'HEAD'], origin: '*' })
        );
        const params = getParams(req);
        if (!params[0]) {
            return res.json({
                endpoints: ['/get', '/get/:id'],
            });
        }
        if (params[0] === 'get') {
            const id = params[1];
            if (!id) {
                const board = await getApiResponse();
                return res.json(board);
            }
            const board = await getStoredBoard(id);
            return !board
                ? jsonErrorResponse(
                      res,
                      404,
                      `Board with id: '${id}' not found`
                  )
                : res.json(board);
        }
        jsonErrorResponse(res, 404, 'Not Found');
    } catch (err: Error | any) {
        jsonErrorResponse(
            res,
            500,
            process.env.NODE_ENV !== 'production' && 'message' in err
                ? err.message
                : 'Internal Server error'
        );
    }
};

export default handler;
