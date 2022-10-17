import { atom, selector } from 'recoil';

export type SectionName = 'start' | 'projects' | 'contact';
export const sections: SectionName[] = ['start', 'projects', 'contact'];

const sectionState = atom<SectionName | null>({
    key: 'SectionState',
    default: null,
});

const currentSectionState = selector({
    key: 'SectionStateSelector',
    get: ({ get }) => {
        return get(sectionState);
    },
    set: ({ get, set }, section: SectionName) => {
        const prev = get(sectionState);
        if (prev === section || !sections.includes(section)) return;
        set(sectionState, section);
    },
});

export default currentSectionState;
