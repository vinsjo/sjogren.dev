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
        const mobile = useIsMobile();
        const { innerWidth, innerHeight } = useWindowSize();
        const maxSize = useMemo(() => {
            if (!mobile || !innerWidth || !innerHeight) return null;
            console.log(innerWidth, innerHeight);
            return { maxWidth: innerWidth, maxHeight: innerHeight };
        }, [mobile, innerWidth, innerHeight]);
        const [loaded, setLoaded] = useState(false);
        return (
            <div className={styles.container} style={maxSize}>
                <div className={styles['caption-container']}>
                    <h1 className={classNames('title', styles.caption)}>
                        Vincent Sjögren
                    </h1>
                    <h3 className={classNames('title', styles.caption)}>
                        Web developer in training
                    </h3>
                </div>
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
            </div>
        );
    },
    { id: 'start', className: styles.section }
);

export default Start;
