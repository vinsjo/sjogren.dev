import { create } from 'zustand';
import { getScreenOrientation } from '@utils/misc';
import { createStoreSelectors } from '@utils/zustand/createStoreSelectors';

export type WindowOrientation = 'portrait' | 'landscape';
export type ScreenOrientation = OrientationType | WindowOrientation;

export interface OrientationStore {
    orientation: WindowOrientation;
    screenOrientation: ScreenOrientation;
    setOrientation: (orientation: WindowOrientation) => void;
}

export const useOrientationStore = create<OrientationStore>((set, get) => ({
    orientation: 'portrait',
    screenOrientation: 'portrait',
    setOrientation: (orientation) => {
        const prevState = get();
        const nextState: Omit<OrientationStore, 'setOrientation'> = {
            orientation,
            screenOrientation: getScreenOrientation() || orientation,
        };
        if (
            (
                ['orientation', 'setOrientation'] as Array<
                    keyof typeof nextState
                >
            ).some((key) => prevState[key] !== nextState[key])
        ) {
            set(nextState);
        }
    },
}));

export const selectors = createStoreSelectors(useOrientationStore);

export const useOrientation = () => useOrientationStore(selectors.orientation);
export const useScreenOrientation = () =>
    useOrientationStore(selectors.screenOrientation);
