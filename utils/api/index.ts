import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

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

export function createApiHandler(handler: NextApiHandler): NextApiHandler {
    return async (req, res) => {
        const allowedMethods = res.getHeader('access-control-allow-methods');
        if (
            typeof allowedMethods === 'string' &&
            req.method &&
            !allowedMethods.includes(req.method)
        ) {
            return jsonErrorResponse(
                res,
                405,
                `method '${req.method}' not allowed`
            );
        }
        await handler(req, res);
        if (!res.writableEnded) res.end();
    };
}
