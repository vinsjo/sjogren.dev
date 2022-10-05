import type { NextPage } from 'next';
import Head from '@components/Head';
import React, { useState } from 'react';
import { classNames } from '@utils/client';
import styles from '../styles/Home.module.css';
import { Octokit } from 'octokit';

const BlobScene = React.lazy(() => import('@components/Three/Blob/BlobScene'));

const keywords = ['Three.js'];

export async function getServerSideProps() {
    const token = process.env.GH_API_ACCESS_KEY;

    return { props: {} };
}

const Home: NextPage = () => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className={styles.container}>
            <Head keywords={keywords} />
            <main className={styles.main}>
                <section className={classNames(styles.section, styles.hero)}>
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
                        <React.Suspense>
                            <BlobScene onCreated={() => setLoaded(true)} />
                        </React.Suspense>
                    </div>
                </section>
                <section className={classNames(styles.section, styles.hero)}>
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
                        <React.Suspense>
                            <BlobScene onCreated={() => setLoaded(true)} />
                        </React.Suspense>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
