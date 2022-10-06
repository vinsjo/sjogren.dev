import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from '@components/Head';
import { useState, useEffect } from 'react';
import { classNames } from '@utils/react';
import styles from '../styles/Home.module.css';
import { Octokit } from 'octokit';
import ClientRender from '@components/Utilities/ClientRender';
import useWindowSize from '@hooks/useWindowSize';

const BlobScene = dynamic(() => import('@components/Three/Blob/BlobScene'), {
    suspense: true,
});

const keywords = ['Three.js'];

// export async function getServerSideProps() {
//     const token = process.env.GH_API_ACCESS_KEY;

//     return { props: {} };
// }

const Home: NextPage = () => {
    const [loaded, setLoaded] = useState(false);
    const windowSize = useWindowSize();
    const [sectionStyle, setSectionStyle] = useState(null);
    useEffect(() => {
        const { innerWidth: width, innerHeight: height } = windowSize;
        if (!width || !height) return;
        setSectionStyle({ width, height });
    }, [windowSize]);
    return (
        <div className={styles.container}>
            <Head keywords={keywords} />
            <main className={styles.main}>
                <section className={styles.section} style={sectionStyle}>
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
            </main>
        </div>
    );
};

export default Home;
