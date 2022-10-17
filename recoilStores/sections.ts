import { atom } from 'recoil';

export type SectionName = 'start' | 'projects' | 'contact';
export const sections: SectionName[] = ['start', 'projects', 'contact'];
export const paths: Record<SectionName, string> = {
    start: '/',
    contact: '/contact',
    projects: '/projects',
};

const currentSectionState = atom<SectionName | null>({
    key: 'CurrentSectionState',
    default: null,
});

export default currentSectionState;
