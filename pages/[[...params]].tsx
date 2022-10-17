import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sections, type SectionName } from '@recoil/sections';

import Navigation from '@components/navigation/Navigation';
import Head from '@components/Head';
import { Start, Projects, Contact } from '@components/sections';
import { fetchRepos, type PartialRepo } from '@utils/api/github-api';
import useDidMount from '@hooks/useDidMount';

import styles from 'styles';

interface PageProps {
    repos?: PartialRepo[];
    initialPath?: string;
}

const pathToSection = (path: string): SectionName => {
    if (!path || path === '/') return 'start';
    return sections.find((section) => {
        return path.indexOf(section) === 1;
    });
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
    req,
    res,
}) => {
    res.setHeader(
        'Cache-Control',
        'public, max-age=1800, stale-while-revalidate=3600'
    );
    const repos = await fetchRepos();
    return {
        props: {
            repos,
            initialPath: req.url,
        },
    };
};

const useSectionRefs = () => {
    const start = useRef<HTMLDivElement>();
    const projects = useRef<HTMLDivElement>();
    const contact = useRef<HTMLDivElement>();
    return useMemo(
        () => ({
            start,
            projects,
            contact,
        }),
        [start, projects, contact]
    );
};

const Home: NextPage = ({ repos, initialPath }: PageProps) => {
    const refs = useSectionRefs();
    const didMount = useDidMount();
    const { asPath } = useRouter();

    const [currentSection, setCurrentSection] = useState(
        pathToSection(asPath) || 'start'
    );
    const prevSection = useRef(currentSection);

    const scrollToElement = useCallback(
        async (element: Element, scrollBehavior?: ScrollBehavior) => {
            if (!element) return;
            element.scrollIntoView(
                !scrollBehavior ? undefined : { behavior: scrollBehavior }
            );
        },
        []
    );

    useEffect(() => {
        if (didMount) return;
        const section = pathToSection(initialPath);
        if (!section || section === 'start') return;
        scrollToElement(document.querySelector(`#${section}`));
    }, [didMount, initialPath, scrollToElement]);

    useEffect(() => {
        setCurrentSection(pathToSection(asPath));
    }, [asPath]);

    useEffect(() => {
        if (currentSection === prevSection.current) return;
        prevSection.current = currentSection;
        scrollToElement(refs[currentSection].current, 'smooth');
    }, [didMount, refs, currentSection, scrollToElement]);

    return (
        <div className={styles.container}>
            <Head />
            <main className={styles.main}>
                <Navigation />
                <Start ref={refs.start} />
                <Projects ref={refs.projects} repos={repos} />
                <Contact ref={refs.contact} />
            </main>
        </div>
    );
};

export default Home;
