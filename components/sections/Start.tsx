import { useMemo, useState } from 'react';
import { createSection } from './Section';
import ClientRender from '@components/utilities/ClientRender';
import { classNames } from '@utils/react';
import dynamic from 'next/dynamic';
import { useIsMobile, useWindowSize } from '@hooks/recoil';
import styles from './Start.module.css';

const BlobScene = dynamic(() => import('@components/three/BlobScene'), {
    ssr: false,
    suspense: true,
});

const Start = createSection(
    () => {
        const [loaded, setLoaded] = useState(false);
        const mobile = useIsMobile();
        return (
            <>
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
                        loaded && styles.loaded,
                        mobile && styles.mobile
                    )}
                >
                    <ClientRender withSuspense={true}>
                        <BlobScene onCreated={() => setLoaded(true)} />
                    </ClientRender>
                </div>
            </>
        );
    },
    { className: styles.section, id: 'start' }
);

export default Start;
