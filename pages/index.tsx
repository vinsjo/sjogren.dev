import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from '@components/Head';
import { useState, useEffect, useMemo } from 'react';
import { classNames } from '@utils/react';
import { pickProps } from '@utils/misc';
import styles from '../styles/Home.module.css';
import ClientRender from '@components/Utilities/ClientRender';
import useWindowSize from '@hooks/useWindowSize';
import axios from 'axios';
import GitHubAPI from 'types/github-api';
// import { fetchRepos, PartialRepo } from '@utils/misc/github-api';

const BlobScene = dynamic(() => import('@components/Three/Blob/BlobScene'), {
    suspense: true,
});

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
    const [loaded, setLoaded] = useState(false);
    const windowSize = useWindowSize();
    const [sectionProps, setSectionProps] = useState({
        className: styles.section,
        style: null,
    });
    useEffect(() => {
        const { innerWidth: width, innerHeight: height } = windowSize;
        if (!width || !height) return;
        setSectionProps((props) => ({ ...props, style: { width, height } }));
    }, [windowSize]);
    return (
        <div className={styles.container}>
            <Head keywords={keywords} />
            <main className={styles.main}>
                <section id="start" {...sectionProps}>
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
                            loaded ? styles.loaded : null
                        )}
                    >
                        <ClientRender withSuspense>
                            <BlobScene onCreated={() => setLoaded(true)} />
                        </ClientRender>
                    </div>
                </section>
                <section id="repos" {...sectionProps}></section>
            </main>
        </div>
    );
};

export default Home;
