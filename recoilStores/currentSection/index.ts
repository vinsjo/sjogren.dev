import { atom } from 'recoil';

export type SectionName = 'start' | 'projects' | 'contact';
export const sections: SectionName[] = ['start', 'projects', 'contact'];

const currentSectionState = atom<SectionName | null>({
    key: 'CurrentSectionState',
    default: null,
});

export default currentSectionState;
