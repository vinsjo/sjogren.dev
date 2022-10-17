import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { sections, paths, type SectionName } from '@recoil/sections';

import Navigation from '@components/navigation/Navigation';
import Head from '@components/Head';
import { Start, Projects, Contact } from '@components/sections';

import { windowExists } from '@utils/misc';
import { fetchRepos, type PartialRepo } from '@utils/api/github-api';
import { useWindowScroll, useWindowSize } from '@hooks/recoil';
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

const useIsScrolling = () => {
    const { scrollY } = useWindowScroll();
    const [isScrolling, setIsScrolling] = useState(false);
    useEffect(() => {
        setIsScrolling(true);
    }, [scrollY]);

    useEffect(() => {
        if (!isScrolling) return;
        const timeout = setTimeout(() => {
            setIsScrolling(false);
        }, 10);
        return () => clearTimeout(timeout);
    }, [scrollY, isScrolling]);

    return isScrolling;
};

const Home: NextPage = ({ repos, initialPath }: PageProps) => {
    const refs = useSectionRefs();
    const didMount = useDidMount();
    const isScrolling = useIsScrolling();
    const { innerHeight } = useWindowSize();
    const { asPath, push } = useRouter();

    const [currentSection, setCurrentSection] = useState(
        pathToSection(asPath) || 'start'
    );
    const [visibleSection, setVisibleSection] = useState(currentSection);
    const prevPath = useRef(asPath);
    const prevSection = useRef(currentSection);
    const updatingPath = useRef(false);

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
        if (prevPath.current === asPath) return;
        prevPath.current = asPath;
        setCurrentSection(pathToSection(asPath));
    }, [asPath]);

    useEffect(() => {
        if (currentSection === prevSection.current) return;
        prevSection.current = currentSection;
        scrollToElement(refs[currentSection].current, 'smooth');
    }, [didMount, refs, currentSection, scrollToElement]);

    useEffect(() => {
        if (!didMount || isScrolling) return;
        if (Object.keys(refs).some((key) => !refs[key].current)) return;
        const margin = innerHeight * 0.5;
        const getBottomDistance = (element: HTMLElement) => {
            const { top, height } = element.getBoundingClientRect();
            return top + height;
        };
        let section: SectionName;
        for (let i = 0; i < sections.length; i++) {
            section = sections[i];
            if (i >= sections.length - 1) break;
            const toBottom = getBottomDistance(refs[section].current);
            if (toBottom >= margin) break;
        }
        setVisibleSection(section);
    }, [didMount, refs, isScrolling, innerHeight, asPath, push]);

    useEffect(() => {
        if (!didMount || currentSection === visibleSection) return;
        const path = paths[visibleSection];
        if (asPath === path) return;
        const controller = new AbortController();
        new Promise((resolve, reject) => {
            controller.signal.addEventListener('abort', () =>
                reject('aborted')
            );
            updatingPath.current = true;
            push(path, undefined, { shallow: true })
                .then(resolve)
                .catch((err) => reject(err));
        })
            .catch((err) => {
                if (process.env.NODE_ENV === 'production') return;
                console.error(err);
            })
            .finally(() => {
                updatingPath.current = false;
            });
        return () => controller.abort();
    }, [didMount, currentSection, visibleSection, push, asPath]);
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
