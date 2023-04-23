import cors from 'cors';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import ApiError from './ApiError';

export type middlewareResultHandler = (result: Error | any) => void;
export type middleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    next: middlewareResultHandler
) => void;

export function getParams(req: NextApiRequest, paramAlias = 'params') {
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

export function createApiHandler(
    handler: NextApiHandler,
    useCors = false
): NextApiHandler {
    return async (req, res) => {
        try {
            const allowedMethods = res.getHeader(
                'access-control-allow-methods'
            );
            if (
                typeof allowedMethods === 'string' &&
                req.method &&
                !allowedMethods.includes(req.method)
            ) {
                throw new ApiError(405, `method '${req.method}' not allowed`);
            }
            if (useCors) {
                await runMiddleWare(req, res, cors({ origin: '*' }));
            }
            await handler(req, res);
            if (!res.writableEnded) res.end();
        } catch (err) {
            if (err instanceof ApiError) return err.send(res);
            new ApiError(
                500,
                process.env.NODE_ENV !== 'production' && 'message' in err
                    ? err.message
                    : 'Internal Server error'
            ).send(res);
        }
    };
}
