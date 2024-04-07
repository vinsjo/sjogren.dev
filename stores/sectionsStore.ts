import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createStoreSelectors } from '@/utils/zustand/createStoreSelectors';

export enum PageSection {
  Start = 'start',
  Projects = 'projects',
  Contact = 'contact',
}

export const sections = Object.values(PageSection);

export const sectionPaths = {
  [PageSection.Start]: '/',
  [PageSection.Contact]: '/contact',
  [PageSection.Projects]: '/projects',
} satisfies Record<PageSection, string>;

export interface SectionStore extends Record<PageSection, boolean> {
  setVisible: (section: PageSection, visible?: boolean) => void;
}

export const useSectionsStore = create<SectionStore>((set, get) => ({
  [PageSection.Start]: false,
  [PageSection.Projects]: false,
  [PageSection.Contact]: false,
  currentSection: PageSection.Start,
  setVisible: (section, visible = true) => {
    if (get()[section] === visible) return;
    set({ [section]: visible });
    if (visible === true && typeof window !== 'undefined') {
      window.location.hash = section === PageSection.Start ? '' : `#${section}`;
    }
  },
}));

export const selectors = createStoreSelectors(useSectionsStore);

const visibleSectionsSelector = (state: SectionStore) => {
  const visibleSections = {} as Record<PageSection, boolean>;
  sections.forEach((section) => (visibleSections[section] = state[section]));
  return visibleSections;
};

export const useVisibleSections = () =>
  useSectionsStore(visibleSectionsSelector, shallow);
