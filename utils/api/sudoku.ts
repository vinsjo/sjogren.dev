import path from 'node:path';
import fs from 'node:fs';
import { isArr, isInt, isObj, isStr } from 'x-is-type';
import { v4 as uuidv4 } from 'uuid';
import safeJSON from 'safe-json-decode';
import {
    cloneArrayRecursive,
    objectEntries,
    rand_int,
    shuffle_arr,
} from '@utils/misc';

export declare namespace Sudoku {
    type Level = 'easy' | 'medium' | 'hard' | 'master';
    interface Config {
        readonly DATA_DIR: string;
        readonly BOARD_CELLS: number;
        readonly EMPTY_VALUE: 0;
        readonly MAX_RECURSIONS: number;
        readonly STORAGE_LIMIT: number;
        readonly LEVELS: Record<Level, number>;
    }
    type Value = Config['EMPTY_VALUE'] | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    type Row = [Value, Value, Value, Value, Value, Value, Value, Value, Value];
    type Board = [Row, Row, Row, Row, Row, Row, Row, Row, Row];
    type Unsolved = Record<Level, Board>;
    interface Response {
        id: string;
        solution: Board;
        unsolved: Unsolved;
    }
}

const DATA_DIR = path.join(path.resolve(), 'data/sudoku');

export const config: Sudoku.Config = {
    DATA_DIR,
    BOARD_CELLS: 9 * 9,
    EMPTY_VALUE: 0,
    MAX_RECURSIONS: 2000,
    STORAGE_LIMIT: 2000,
    LEVELS: {
        easy: 27,
        medium: 38,
        hard: 42,
        master: 52,
    },
};

export const isSudokuBoard = (data: unknown): data is Sudoku.Board => {
    if (!isArr(data)) return false;
    return (
        data.length === 9 &&
        data.every(
            (row) =>
                isArr(row) &&
                row.length === 9 &&
                row.every((value) => isInt(value) && value >= 0 && value <= 9)
        )
    );
};

export const isUnsolvedBoards = (data: unknown): data is Sudoku.Unsolved => {
    if (!isObj(data)) return false;
    return objectEntries(data).every(
        ([key, value]) => key in config.LEVELS && isSudokuBoard(value)
    );
};

export const isSudokuResponse = (data: unknown): data is Sudoku.Response => {
    if (!isObj(data)) return false;
    const { id, solution, unsolved } = data;
    return isStr(id) && isSudokuBoard(solution) && isUnsolvedBoards(unsolved);
};

function getBoxMin(row: number, col: number) {
    if (row < 0 || row >= 9) {
        row = Math.max(Math.min(row, 9 - 1), 0);
    }
    if (col < 0 || col >= 9) {
        col = Math.max(Math.min(col, 9 - 1), 0);
    }
    return {
        row: Math.floor(row - (row % 3)),
        col: Math.floor(col - (col % 3)),
    };
}

function isSafe(
    board: Sudoku.Board,
    row: number,
    col: number,
    num: Sudoku.Value
) {
    if (!isInt(row) || !isInt(col)) {
        throw `Invalid row or col: ${col}, ${row}`;
    }
    //Row Clash
    for (let c = 0; c < board.length; c++) {
        if (board[row][c] === num) return false;
    }
    //Column Clash
    for (let r = 0; r < board.length; r++) {
        if (board[r][col] === num) return false;
    }
    const min = getBoxMin(row, col);
    //Box Clash
    for (let r = min.row; r < min.row + 3; r++) {
        for (let c = min.col; c < min.col + 3; c++) {
            if (board[r][c] === num) return false;
        }
    }
    return true;
}

function cloneBoard(board: Sudoku.Board): Sudoku.Board {
    return cloneArrayRecursive(board);
}

function nextEmptyCell(board: Sudoku.Board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            if (board[row][col] !== config.EMPTY_VALUE) continue;
            return { row, col };
        }
    }
    return false;
}

function createEmptyBoard(): Sudoku.Board {
    return [...Array(9)].map(() =>
        Array(9).fill(config.EMPTY_VALUE)
    ) as Sudoku.Board;
}
function fillBoard(
    board: Sudoku.Board,
    counter: number = 0
): Sudoku.Board | false {
    const cell = nextEmptyCell(board);
    if (!cell) return board;
    const { row, col } = cell;
    const numbers: Sudoku.Value[] = shuffle_arr([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 0; i < board.length; i++) {
        counter++;
        if (counter > config.MAX_RECURSIONS)
            throw 'Exceeded maximum recursions';
        if (!isSafe(board, row, col, numbers[i])) continue;
        let clone = cloneBoard(board);
        clone[row][col] = numbers[i];
        const filled = fillBoard(clone, counter);
        if (!filled) continue;
        return filled;
    }
    return false;
}

function randomCell(board: Sudoku.Board) {
    const [row, col] = [rand_int(board.length), rand_int(board.length)];
    return {
        row,
        col,
        value: board[row][col],
    };
}

async function unsolveBoard(solvedBoard: Sudoku.Board, emptyCells: number = 0) {
    if (!Array.isArray(solvedBoard)) return solvedBoard;
    let unsolved = cloneBoard(solvedBoard);
    let removedCount = 0;
    while (removedCount < emptyCells && removedCount < Math.pow(9, 2)) {
        const { row, col, value } = randomCell(unsolved);
        if (!value) continue;
        const clone = cloneBoard(unsolved);
        clone[row][col] = config.EMPTY_VALUE;
        if (!fillBoard(clone)) continue;
        unsolved = clone;
        removedCount++;
    }
    return unsolved;
}

export async function createBaseBoard(
    maxTries: number = 5,
    tries: number = 1
): Promise<Sudoku.Board> {
    try {
        const empty = createEmptyBoard();
        const board = fillBoard(empty);
        if (!board) throw 'Failed creating board';
        return board;
    } catch (e) {
        if (tries < maxTries) return createBaseBoard(tries + 1);
        throw e;
    }
}

export async function createBoard(
    writeToFile = true
): Promise<Sudoku.Response | null> {
    try {
        const solution = await createBaseBoard();
        const unsolvedEntries = (await Promise.all(
            Object.entries(config.LEVELS).map(async ([name, emptyCells]) => {
                const unsolved = await unsolveBoard(solution, emptyCells);
                return [name, unsolved];
            })
        )) as [Sudoku.Level, Sudoku.Board][];

        const unsolved = unsolvedEntries.reduce((unsolved, [name, board]) => {
            return { ...unsolved, [name]: board };
        }, {}) as Sudoku.Unsolved;
        const board: Sudoku.Response = { id: uuidv4(), solution, unsolved };

        if (writeToFile) {
            try {
                if (!fs.existsSync(DATA_DIR)) {
                    fs.mkdirSync(DATA_DIR, { recursive: true });
                }
                const json = safeJSON.encode(board);
                await fs.promises.writeFile(
                    path.join(config.DATA_DIR, `${board.id}.json`),
                    json,
                    {
                        encoding: 'utf-8',
                    }
                );
            } catch (err) {
                console.error(err instanceof Error ? err.message : err);
            }
        }
        return board;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getStoredBoard(
    id: string
): Promise<Sudoku.Response | null> {
    try {
        if (!fs.existsSync(DATA_DIR)) return null;
        const jsonPath = path.join(config.DATA_DIR, `${id}.json`);
        if (!fs.existsSync(jsonPath)) return null;
        const data = await fs.promises.readFile(jsonPath, {
            encoding: 'utf-8',
        });
        const board = safeJSON.decode(data);
        return !isSudokuResponse(board) ? null : board;
    } catch (err) {
        return null;
    }
}

export async function getAllBoards(): Promise<Sudoku.Response[]> {
    try {
        if (!fs.existsSync(DATA_DIR)) return null;
        const files = await fs.promises.readdir(config.DATA_DIR);
        const boards = await Promise.all<null | Sudoku.Response>(
            files.map(async (file) => {
                try {
                    const json = await fs.promises.readFile(
                        path.join(config.DATA_DIR, file),
                        { encoding: 'utf-8' }
                    );
                    const board = safeJSON.decode(json);
                    return !isSudokuResponse(board) ? null : board;
                } catch (err) {
                    return null;
                }
            })
        );
        return boards.filter((b) => !!b);
    } catch (err) {
        return [];
    }
}
