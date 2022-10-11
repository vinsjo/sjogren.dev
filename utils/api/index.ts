import type { NextApiRequest, NextApiResponse } from 'next';

export type middlewareResultHandler = (result: Error | any) => void;
export type middleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    next: middlewareResultHandler
) => void;

export function getParams(req: NextApiRequest, paramAlias: string = 'params') {
    return req.query[paramAlias] || [];
}

export function runMiddleWare(
    req: NextApiRequest,
    res: NextApiResponse,
    middleware: middleware
) {
    return new Promise((resolve, reject) => {
        middleware(req, res, (result) =>
            result instanceof Error ? reject(result) : resolve(result)
        );
    });
}

export function jsonErrorResponse(
    res: NextApiResponse,
    status: number,
    message: string
) {
    res.status(status).json({ error: message });
}
