import type { NextPage, GetServerSideProps } from 'next';
import Head from '@components/Head';
import { fetchRepos, type PartialRepo } from '@utils/misc/github-api';
import { Start, Repos } from '@components/sections';
import styles from 'styles';

interface PageProps {
    repos?: PartialRepo[];
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
    const repos = await fetchRepos();
    return { props: { repos } };
};

const Home: NextPage = ({ repos }: PageProps) => {
    return (
        <div className={styles.container}>
            <Head />
            <main className={styles.main}>
                <Start />
                <Repos repos={repos} />
            </main>
        </div>
    );
};

export default Home;
