import { createApiHandler } from '@utils/api';
import ApiError from '@utils/api/ApiError';
import { getStoredBoard } from '@utils/api/sudoku';
import { isStr } from 'x-is-type';

export default createApiHandler(async (req, res) => {
  const { id } = req.query;
  if (!isStr(id)) {
    throw new ApiError(404);
  }
  const board = await getStoredBoard(id);
  if (!board) {
    throw new ApiError(404, `Board with id: '${id}' not found`);
  }
  res.json({ board });
}, true);
