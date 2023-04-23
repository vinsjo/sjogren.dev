import type { RootState } from '@react-three/fiber';

export const createSelectors = <K extends keyof RootState>(
    ...keys: K[]
): { [key in K]: (state: RootState) => RootState[key] } => {
    const selectors = Object.assign(
        {},
        ...keys.map((key) => (state: RootState) => state[key])
    ) satisfies { [key in K]: (state: RootState) => RootState[key] };
    return selectors;
};
