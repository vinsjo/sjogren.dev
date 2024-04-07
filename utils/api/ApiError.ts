import { NextApiResponse } from 'next';
import { isNum } from 'x-is-type';

const httpErrorCodes = [400, 401, 403, 404, 405, 500] as const;

/** A selection of HTTP Error status codes */
export type HTTPErrorCode = (typeof httpErrorCodes)[number];

export default class ApiError extends Error {
  static readonly DEFAULT_ERROR_MESSAGES: Record<HTTPErrorCode, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    500: 'Internal Server Error',
  };

  static isErrorCode(code: unknown): code is HTTPErrorCode {
    return isNum(code) && (httpErrorCodes as readonly number[]).includes(code);
  }

  statusCode: HTTPErrorCode;

  constructor(statusCode?: HTTPErrorCode, message?: string) {
    if (!ApiError.isErrorCode(statusCode)) {
      statusCode = 500;
    }
    super(message || ApiError.DEFAULT_ERROR_MESSAGES[statusCode]);

    this.statusCode = statusCode;

    this.send = this.send.bind(this);
  }
  send(res: NextApiResponse) {
    res.status(this.statusCode).json({ error: this.message });
  }
}
