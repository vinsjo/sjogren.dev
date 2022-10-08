import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from '@components/Head';
import { useState, useEffect, useMemo } from 'react';
import { classNames, compareState } from '@utils/react';
import { pick } from '@utils/misc';
import styles from '../styles/Home.module.css';
import ClientRender from '@components/Utilities/ClientRender';
import useWindowSize from '@hooks/useWindowSize';
import axios from 'axios';
import GitHubAPI from 'types/github-api';
// import { fetchRepos, PartialRepo } from '@utils/misc/github-api';

const BlobScene = dynamic(() => import('@components/Three/Blob/BlobScene'), {
    suspense: true,
});

type SectionProps = {
    style?: { width: number; height: number };
};

const Start = (props: SectionProps) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <section className={styles.section} id={styles.start} {...props}>
            <h1 className={styles.caption}>
                <a
                    href="mailto:vincent@sjogren.dev"
                    target="_blank"
                    title="Contact Me"
                    rel="noreferrer"
                >
                    vincent@sjogren.dev
                </a>
            </h1>
            <div
                className={classNames(
                    styles['blob-container'],
                    loaded && styles.loaded
                )}
            >
                <ClientRender withSuspense>
                    <BlobScene onCreated={() => setLoaded(true)} />
                </ClientRender>
            </div>
        </section>
    );
};

const Repos = (props: SectionProps) => {
    return (
        <section className={styles.section} id={styles.repos} {...props}>
            repos
        </section>
    );
};

const Sections = () => {
    const windowSize = useWindowSize();
    const [props, setProps] = useState<{
        style?: { width: number; height: number };
    }>({});
    useEffect(() => {
        const { innerWidth: width, innerHeight: height } = windowSize;
        if (!width || !height) return;
        setProps((prev) => compareState(prev, { style: { width, height } }));
    }, [windowSize]);
    return (
        <>
            <Start {...props} />
            {/* <Repos {...props} /> */}
        </>
    );
};

const keywords = ['Three.js'];
// interface PageProps {
//     repos?: PartialRepo[];
// }

// export async function getServerSideProps(): Promise<{ props: PageProps }> {
//     const repos = await fetchRepos();
//     return { props: { repos } };
// }

// const Home: NextPage = (props: PageProps) => {
const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head keywords={keywords} />
            <main className={styles.main}>
                <Sections />
            </main>
        </div>
    );
};

export default Home;
