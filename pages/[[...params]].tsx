import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';

import { fetchRepos, type PartialRepo } from '@utils/api/github-api';

import Navigation from '@components/navigation/Navigation';
import { useRecoilState } from 'recoil';
import currentSectionState, {
    sections,
    type SectionName,
} from '@recoil/currentSection';
import styles from 'styles';
import useDidMount from '@hooks/useDidMount';
import Head from '@components/Head';
import { Start, Projects, Contact } from '@components/sections';

interface PageProps {
    repos?: PartialRepo[];
    route?: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
    req,
}) => {
    const repos = await fetchRepos();
    return {
        props: {
            repos,
            route: req.url,
        },
    };
};

const pathToSection = (path: string) => {
    if (!path) return null;
    const section = path.split('/').filter((v) => v)[0] as
        | SectionName
        | undefined;
    return !sections.includes(section) ? 'start' : section;
};
const sectionToPath = (section: SectionName) => {
    return !sections.includes(section) || section === 'start'
        ? '/'
        : `/${section}`;
};

const Home: NextPage = ({ repos }: PageProps) => {
    const didMount = useDidMount();
    const router = useRouter();

    const [currentSection, setCurrentSection] =
        useRecoilState(currentSectionState);
    const sectionRef = useRef(currentSection);

    const currentPath = useMemo(() => router.asPath, [router.asPath]);
    const initialPath = useRef(currentPath);

    // Set currentSection from path, only on first render
    useEffect(() => {
        if (didMount) return;
        let section = initialPath.current.split('/').filter((v) => v)[0] as
            | SectionName
            | undefined;
        if (!sections.includes(section)) section = 'start';
        if (section === currentSection) return;
        setCurrentSection(section);
    }, [didMount, initialPath, currentSection, setCurrentSection]);

    // Scroll into view when section changes
    useEffect(() => {
        if (!currentSection || sectionRef.current === currentSection) return;
        const section = document.querySelector(`#${currentSection}`);
        if (!section) return setCurrentSection(sectionRef.current);
        section.scrollIntoView(
            !sectionRef.current ? undefined : { behavior: 'smooth' }
        );
        sectionRef.current = currentSection;
    }, [currentSection, setCurrentSection, sectionRef]);

    // Push path to url when section changes, after first render
    useEffect(() => {
        if (!didMount) return;
        const path = sectionToPath(currentSection);
        if (path === currentPath) return;
        router.push(path, undefined, { shallow: true });
    }, [didMount, currentSection, currentPath, router]);

    return (
        <div className={styles.container}>
            <Head />
            <main className={styles.main}>
                <Navigation />
                <Start />
                <Projects repos={repos} />
                <Contact />
            </main>
        </div>
    );
};

export default Home;
