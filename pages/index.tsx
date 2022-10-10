import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from '@components/Head';
import { useState, HTMLProps, useMemo } from 'react';
import { classNames } from '@utils/react';
import styles from '../styles/Home.module.css';
import ClientRender from '@components/Utilities/ClientRender';
import { useWindowSize, useIsMobile, useIsRotating } from '@hooks/recoil';
import axios from 'axios';
import GitHubAPI from 'types/github-api';
import RecoilStoreManager from '@components/Utilities/RecoilStoreManager';
// import { fetchRepos, PartialRepo } from '@utils/misc/github-api';

const BlobScene = dynamic(() => import('@components/Three/Blob/BlobScene'), {
    suspense: true,
    ssr: false,
});

type SectionProps = Omit<HTMLProps<HTMLDivElement>, 'className'>;

const Section = (props: SectionProps) => {
    const { innerWidth: width, innerHeight: height } = useWindowSize();
    return (
        <section
            className={styles.section}
            style={{ width: width || null, height: height || null }}
            {...props}
        >
            {props.children}
        </section>
    );
};

const Start = (props: SectionProps) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <Section id={styles.start} {...props}>
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
        </Section>
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
    const mobile = useIsMobile();
    return (
        <>
            <RecoilStoreManager />
            <div className={styles.container}>
                <Head keywords={keywords} />
                <main className={classNames(styles.main, mobile && 'mobile')}>
                    <Start />
                </main>
            </div>
        </>
    );
};

export default Home;
