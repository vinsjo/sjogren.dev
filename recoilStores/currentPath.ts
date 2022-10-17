import { atom } from 'recoil';
import type { SectionName } from '@recoil/sections';

export const sectionPaths: Record<SectionName, string> = {
    start: '/',
    contact: '/contact',
    projects: '/projects',
};

const currentPathState = atom<string>({
    key: 'CurrentPathState',
    default: '/',
});

export default currentPathState;
