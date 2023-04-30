import type { NextPage, GetServerSideProps } from 'next';

import Navigation from '@components/navigation/Navigation';
import Head from '@components/Head';
import { Start, Projects, Contact } from '@components/sections';
import { fetchRepos, type PartialRepo } from '@utils/api/github-api';

import styles from 'styles';

interface PageProps {
    repos: PartialRepo[];
}

// const getSectionFromPath = (path: string): SectionName | undefined => {
//     const trimmed = path.split('/').filter(Boolean)[0]?.trim();
//     return sections.find((name) => name === trimmed);
// };

// const scrollToElement = (element: Element, smooth = false) => {
//     element?.scrollIntoView(!smooth ? undefined : { behavior: 'smooth' });
// };

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
    res,
}) => {
    const maxAge = 7200;
    res.setHeader(
        'Cache-Control',
        `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge + 100}`
    );
    const repos = await fetchRepos();
    return {
        props: {
            repos: repos ?? [],
        },
    };
};

const Home: NextPage = ({ repos }: PageProps) => {
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
