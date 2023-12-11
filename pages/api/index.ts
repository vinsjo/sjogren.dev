// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createApiHandler } from '@utils/api';

export default createApiHandler((req, res) => {
  res.status(200).json({ endpoints: ['/sudoku'] });
});
