import { createApiHandler } from '@utils/api';

export default createApiHandler((req, res) => {
    res.json({
        endpoints: ['/boards', '/boards/:id', '/boards/create'],
    });
}, true);
