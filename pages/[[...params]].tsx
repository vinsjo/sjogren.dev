import type { NextPage, GetServerSideProps } from 'next';

import { Navigation } from '@/components/Navigation';
import { Head } from '@/components/Head';
import { Start, Projects, Contact } from '@/components/sections';
import { fetchRepos, type PartialRepo } from '@/utils/api/github-api';

import styles from 'styles';
import { useEffect } from 'react';

interface PageProps {
  repos: PartialRepo[];
}

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

const Home: NextPage<PageProps> = ({ repos }) => {
  useEffect(() => document.documentElement.classList.add('loaded'), []);
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
