import path from 'node:path';
import fs from 'node:fs';
import type { SudokuConfig } from './types';

const DATA_DIR = path.join(path.resolve(), 'data/sudoku');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const config: SudokuConfig = {
    DATA_DIR,
    BOARD_SIZE: 9,
    BOARD_CELLS: 9 * 9,
    BOX_SIZE: 3,
    EMPTY_VALUE: 0,
    MAX_RECURSIONS: 2000,
    STORAGE_LIMIT: 2000,
    LEVELS: {
        easy: 27,
        medium: 38,
        hard: 43,
        master: 52,
    },
};

export default config;
