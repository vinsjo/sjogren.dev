import cors from 'cors';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

import ApiError from './ApiError';

export type MiddlewareResultHandler = (result: unknown) => void;

export type Middleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: MiddlewareResultHandler
) => void;

export function getParams(req: NextApiRequest, paramAlias = 'params') {
  return req.query[paramAlias] || [];
}

export function runMiddleWare(
  req: NextApiRequest,
  res: NextApiResponse,
  middleware: Middleware
) {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });
}

export const createInternalServerError: (err: unknown) => ApiError =
  process.env.NODE_ENV === 'production'
    ? () => new ApiError(500)
    : (err) =>
        new ApiError(500, err instanceof Error ? err.message : undefined);

export function createApiHandler(
  handler: NextApiHandler,
  useCors = false
): NextApiHandler {
  return async (req, res) => {
    try {
      const allowedMethods = res.getHeader('access-control-allow-methods');
      if (
        typeof allowedMethods === 'string' &&
        req.method &&
        !allowedMethods.includes(req.method)
      ) {
        throw new ApiError(405, `Method '${req.method}' not allowed`);
      }
      if (useCors) {
        await runMiddleWare(req, res, cors({ origin: '*' }));
      }
      await handler(req, res);
      if (!res.writableEnded) res.end();
    } catch (err) {
      (err instanceof ApiError ? err : createInternalServerError(err)).send(
        res
      );
    }
  };
}
