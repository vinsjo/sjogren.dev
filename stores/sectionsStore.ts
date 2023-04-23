import { createStoreSelectors } from '@utils/zustand/createStoreSelectors';
import { create } from 'zustand';

export type SectionName = 'start' | 'projects' | 'contact';
export const sections: SectionName[] = ['start', 'projects', 'contact'];
export const paths: Record<SectionName, string> = {
    start: '/',
    contact: '/contact',
    projects: '/projects',
};

export interface SectionStore {
    currentSection: SectionName;
    currentPath: string;
    setCurrentSection: (section: SectionName) => void;
}

export const useSectionsStore = create<SectionStore>((set, get) => ({
    currentSection: 'start',
    currentPath: paths['start'],
    setCurrentSection: (currentSection) => {
        if (get().currentSection === currentSection) return;
        set({ currentSection, currentPath: paths[currentSection] });
    },
}));

export const selectors = createStoreSelectors(useSectionsStore);

export const useCurrentSection = () =>
    useSectionsStore(selectors.currentSection);
export const useCurrentPath = () => useSectionsStore(selectors.currentPath);
