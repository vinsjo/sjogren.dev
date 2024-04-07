import { createApiHandler } from '@/utils/api';
import { getAllBoards } from '@/utils/api/sudoku';

export default createApiHandler(async (req, res) => {
  const boards = await getAllBoards();
  res.json({ boards });
}, true);
