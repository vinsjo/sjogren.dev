import type { NextApiRequest, NextApiResponse } from 'next';

export type middlewareResultHandler = (result: Error | any) => void;
export type middleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    next: middlewareResultHandler
) => void;

const getParams = (req: NextApiRequest, paramAlias: string = 'params') =>
    req.query[paramAlias] || [];

const runMiddleWare = (
    req: NextApiRequest,
    res: NextApiResponse,
    middleware: middleware
) => {
    return new Promise((resolve, reject) => {
        middleware(req, res, (result) =>
            result instanceof Error ? reject(result) : resolve(result)
        );
    });
};
export { getParams, runMiddleWare };
