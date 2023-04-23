import { useMemo, useState } from 'react';
import { createSection } from './Section';
import ClientRender from '@components/utilities/ClientRender';
import { classNames } from '@utils/react';
import dynamic from 'next/dynamic';
import { useIsMobile } from 'stores/deviceType';
import styles from './Start.module.css';
import { useWindowSize } from 'stores/windowSizeStore';

const BlobScene = dynamic(() => import('@components/three/BlobScene'), {
    ssr: false,
    suspense: true,
});

const Start = createSection(
    () => {
        const { innerWidth, innerHeight } = useWindowSize();
        const isMobile = useIsMobile();
        const maxSize = useMemo<{
            maxWidth: number;
            maxHeight: number;
        } | null>(() => {
            if (!isMobile || !innerWidth || !innerHeight) return null;
            return { maxWidth: innerWidth, maxHeight: innerHeight };
        }, [isMobile, innerWidth, innerHeight]);

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
                    className={classNames(styles['blob-container'], {
                        [styles.loaded]: loaded,
                        [styles.mobile]: isMobile,
                    })}
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
