export type SudokuEmptyValue = number | null;
export type SudokuValue = SudokuEmptyValue | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type SudokuRow = SudokuValue[];
export type SudokuBoard = SudokuRow[];
export type SudokuUnsolvedBoards = {
    easy: SudokuBoard;
    medium: SudokuBoard;
    hard: SudokuBoard;
    master: SudokuBoard;
};
export type SudokuApiResponse = {
    id: string;
    solution: SudokuBoard;
    unsolved: SudokuUnsolvedBoards;
};
export type SudokuID = string;

export type SudokuConfig = {
    DATA_DIR: string;
    BOARD_SIZE: number;
    BOARD_CELLS: number;
    BOX_SIZE: number;
    EMPTY_VALUE: SudokuEmptyValue;
    MAX_RECURSIONS: number;
    STORAGE_LIMIT: number;
    LEVELS: {
        easy: number;
        medium: number;
        hard: number;
        master: number;
    };
};
