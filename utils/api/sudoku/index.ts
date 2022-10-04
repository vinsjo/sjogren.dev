import fs from 'node:fs';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import safeJSON from 'safe-json-decode';
import { rand_int } from '../../misc';
import config from './config';
import type { SudokuApiResponse } from './types';

function buildBoard(): Promise<SudokuApiResponse | null> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.join(path.resolve(), 'utils/api/sudoku/worker.js')
        );
        worker.on('message', (data) => resolve(data));
        worker.on('error', (err) => reject(err));
    }) as Promise<SudokuApiResponse | null>;
}

async function getBoard(writeJSON = true): Promise<SudokuApiResponse> {
    const files = fs.readdirSync(config.DATA_DIR);
    if (files.length >= config.STORAGE_LIMIT) {
        const file = files[rand_int(files.length)];
        const json = await fs.promises.readFile(
            path.join(config.DATA_DIR, file),
            { encoding: 'utf-8' }
        );
        const board = safeJSON.decode(json);
        if (!board) throw new Error('Failed reading board from JSON');
        return board as SudokuApiResponse;
    }
    const board = await buildBoard();
    if (!board) throw new Error('Failed creating board');

    if (writeJSON) {
        const json = safeJSON.encode(board);
        if (json === null) {
            throw new Error('Failed creating board');
        }
        await fs.promises.writeFile(
            path.join(config.DATA_DIR, `${board.id}.json`),
            json,
            {
                encoding: 'utf-8',
            }
        );
    }
    return board;
}

async function getStoredBoard(id: string) {
    const jsonPath = path.join(config.DATA_DIR, `${id}.json`);
    if (!fs.existsSync(jsonPath)) return null;
    const data = await fs.promises.readFile(jsonPath, {
        encoding: 'utf-8',
    });
    return safeJSON.decode(data);
}

export { getBoard, getStoredBoard, config };
