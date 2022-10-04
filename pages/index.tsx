import type { NextPage } from 'next';
import Head from '@components/Head';
import React, { useState } from 'react';
import { classNames } from '@utils/client';
import styles from '../styles/Home.module.css';
import { ClientRender } from '@components/Utilities';

const BlobScene = React.lazy(() => import('@components/Three/Blob/BlobScene'));

const keywords = ['Three.js'];

const Home: NextPage = () => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className={styles.container}>
            <Head keywords={keywords} />

            <main className={styles.main}>
                <section
                    className={classNames(
                        styles.section,
                        styles.hero,
                        loaded ? styles.loaded : null
                    )}
                >
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
                    <div className={styles['blob-container']}>
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
