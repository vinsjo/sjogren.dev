import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from '@components/Head';
import { useState, useEffect, HTMLProps, useMemo } from 'react';
import { classNames, compareState } from '@utils/react';
import styles from '../styles/Home.module.css';
import ClientRender from '@components/Utilities/ClientRender';
import { useWindowSize } from '@hooks/recoil';
import axios from 'axios';
import GitHubAPI from 'types/github-api';
import RecoilEventSubscriber from '@components/Utilities/RecoilEventSubscriber';
// import { fetchRepos, PartialRepo } from '@utils/misc/github-api';

const BlobScene = dynamic(() => import('@components/Three/Blob/BlobScene'), {
    suspense: true,
    ssr: false,
});

type SectionProps = {
    width?: number;
    height?: number;
};

const Section = (
    props: Omit<HTMLProps<HTMLDivElement>, 'className' | 'style'> & SectionProps
) => {
    const { innerWidth, innerHeight } = useWindowSize();
    const style = useMemo(() => {
        if (!innerWidth || !innerHeight) return null;
        return { width: innerWidth, height: innerHeight };
    }, [innerWidth, innerHeight]);
    return (
        <section className={styles.section} style={style} {...props}>
            {props.children}
        </section>
    );
};

const Start = () => {
    const [loaded, setLoaded] = useState(false);
    return (
        <Section id={styles.start}>
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

const Repos = () => {
    return <Section id={styles.repos}>repos</Section>;
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
        <>
            <RecoilEventSubscriber />
            <div className={styles.container}>
                <Head keywords={keywords} />
                <main className={styles.main}>
                    <Start />
                    <Repos />
                </main>
            </div>
        </>
    );
};

export default Home;
