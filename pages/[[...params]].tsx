import type { NextPage, GetServerSideProps } from 'next';
import { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import currentPathState from '@recoil/currentPath';
import { sections, type SectionName } from '@recoil/sections';

import Navigation from '@components/navigation/Navigation';
import Head from '@components/Head';
import { Start, Projects, Contact } from '@components/sections';

import { windowExists } from '@utils/misc';
import { fetchRepos, type PartialRepo } from '@utils/api/github-api';

import styles from 'styles';

interface PageProps {
    repos?: PartialRepo[];
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
    const repos = await fetchRepos();
    return {
        props: {
            repos,
        },
    };
};

const scrollToSection = (
    section: HTMLDivElement,
    scrollBehavior?: ScrollBehavior
) => {
    if (!windowExists() || !section) return;
    section.scrollIntoView({ behavior: scrollBehavior || 'auto' });
};

const pathToSection = (path: string) => {
    if (!path) return null;
    const section = path.split('/').filter((v) => v)[0] as
        | SectionName
        | undefined;
    return !sections.includes(section) ? 'start' : section;
};

const Home: NextPage = ({ repos }: PageProps) => {
    const currentPath = useRecoilValue(currentPathState);

    const startRef = useRef<HTMLDivElement>();
    const projectsRef = useRef<HTMLDivElement>();
    const contactRef = useRef<HTMLDivElement>();

    const currentSection = useMemo(
        () => pathToSection(currentPath),
        [currentPath]
    );

    const currentRef = useMemo(() => {
        switch (currentSection) {
            case 'projects':
                return projectsRef;
            case 'contact':
                return contactRef;
            default:
                return startRef;
        }
    }, [currentSection]);

    const prevRef = useRef(currentRef.current);

    useEffect(() => {
        if (!currentRef.current || currentRef.current === prevRef.current) {
            return;
        }
        scrollToSection(
            currentRef.current,
            !prevRef.current ? undefined : 'smooth'
        );
        prevRef.current = currentRef.current;
    }, [currentRef]);

    // useEffect(() => {
    //     console.log(windowScroll);
    // }, [windowScroll]);

    return (
        <div className={styles.container}>
            <Head />
            <main className={styles.main}>
                <Navigation />
                <Start ref={startRef} />
                <Projects ref={projectsRef} repos={repos} />
                <Contact ref={contactRef} />
            </main>
        </div>
    );
};

export default Home;
