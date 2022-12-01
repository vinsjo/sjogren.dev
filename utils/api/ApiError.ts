import { NextApiResponse } from 'next';
import { isNum } from 'x-is-type';

/** A selection of HTTP Error status codes */
export type HTTPErrorCode = 400 | 401 | 403 | 404 | 405 | 500;

export const isStatusCode = (code: unknown): code is HTTPErrorCode => {
    if (!isNum(code)) return false;
    return [400, 401, 403, 404, 405, 500].includes(code);
};

const HTTPErrors = new Map<HTTPErrorCode, string>([
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [403, 'Forbidden'],
    [404, 'Not Found'],
    [405, 'Method Not Allowed'],
    [500, 'Internal Server Error'],
]);

export default class ApiError extends Error {
    statusCode: HTTPErrorCode;
    constructor(statusCode?: HTTPErrorCode, message?: string) {
        if (!statusCode || !isStatusCode(statusCode)) {
            statusCode = 500;
        }
        if (!message) message = HTTPErrors.get(statusCode);
        super(message);
        this.statusCode = statusCode;
    }
    send(res: NextApiResponse) {
        res.status(this.statusCode).json({ error: this.message });
    }
}
