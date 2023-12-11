import { createApiHandler } from '@utils/api';
import ApiError from '@utils/api/ApiError';
import { createBoard } from '@utils/api/sudoku';

export default createApiHandler(async (req, res) => {
  const board = await createBoard();
  if (!board) throw new ApiError(500, 'Failed creating board');
  res.status(201).json({ board });
}, true);
