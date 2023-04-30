import type { RootState } from '@react-three/fiber';

export const createSelectors = <K extends keyof RootState>(...keys: K[]) => {
    return Object.fromEntries(
        keys.map((key) => [key, (state: RootState) => state[key]])
    ) as { [key in K]: (state: RootState) => RootState[key] };
};
