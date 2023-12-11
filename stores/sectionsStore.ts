import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createStoreSelectors } from '@utils/zustand/createStoreSelectors';
import { windowExists } from '@utils/misc';

export enum SectionName {
  Start = 'start',
  Projects = 'projects',
  Contact = 'contact',
}

export const sections = Object.values(SectionName);

export const sectionPaths = {
  [SectionName.Start]: '/',
  [SectionName.Contact]: '/contact',
  [SectionName.Projects]: '/projects',
} satisfies Record<SectionName, string>;

export interface SectionStore extends Record<SectionName, boolean> {
  setVisible: (section: SectionName, visible?: boolean) => void;
}

export const useSectionsStore = create<SectionStore>((set, get) => ({
  [SectionName.Start]: false,
  [SectionName.Projects]: false,
  [SectionName.Contact]: false,
  currentSection: SectionName.Start,
  setVisible: (section, visible = true) => {
    if (get()[section] === visible) return;
    set({ [section]: visible });
    if (visible === true && windowExists()) {
      window.location.hash = section === SectionName.Start ? '' : `#${section}`;
    }
  },
}));

export const selectors = createStoreSelectors(useSectionsStore);

const visibleSectionsSelector = (state: SectionStore) => {
  const visibleSections = {} as Record<SectionName, boolean>;
  sections.forEach((section) => (visibleSections[section] = state[section]));
  return visibleSections;
};

export const useVisibleSections = () =>
  useSectionsStore(visibleSectionsSelector, shallow);
