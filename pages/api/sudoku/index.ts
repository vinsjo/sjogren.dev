import { createApiHandler } from '@/utils/api';

export default createApiHandler((_, res) => {
  res.json({
    endpoints: ['/boards', '/boards/:id', '/boards/create'],
  });
}, true);
