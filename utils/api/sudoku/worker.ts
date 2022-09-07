import { parentPort } from 'node:worker_threads';
import { createApiResponse } from './functions';

parentPort instanceof MessagePort &&
	parentPort.postMessage(createApiResponse());
