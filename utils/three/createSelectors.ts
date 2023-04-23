import type { RootState } from '@react-three/fiber';

export const createSelectors = <K extends keyof RootState>(
    ...keys: K[]
): { [key in K]: (state: RootState) => RootState[key] } => {
    return Object.assign(
        {},
        ...keys.map((key) => ({ [key]: (state: RootState) => state[key] }))
    );
};
