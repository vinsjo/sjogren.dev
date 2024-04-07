import { useState } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { createSection } from './Section';

import { withClientRender } from '@/components/utilities/ClientRender';

import { useIsMobile } from '@/stores/deviceType';

import {
  useWindowSizeStore,
  selectors as windowSizeSelectors,
} from '@/stores/windowSizeStore';

import { PageSection } from './constants';

import styles from './Start.module.css';

const BlobScene = withClientRender(
  dynamic(() => import('@/components/three/BlobScene'), {
    ssr: false,
    suspense: true,
  }),
  { withSuspense: true }
);

export const Start = createSection(
  () => {
    const { innerWidth, innerHeight } = useWindowSizeStore(
      windowSizeSelectors.windowSize
    );
    const isMobile = useIsMobile();

    const [loaded, setLoaded] = useState(false);

    const containerStyle: Partial<
      Pick<React.CSSProperties, 'maxWidth' | 'maxHeight'>
    > = {};

    if (isMobile) {
      if (innerWidth) {
        containerStyle.maxWidth = innerWidth;
      }
      if (innerHeight) {
        containerStyle.maxHeight = innerHeight;
      }
    }

    return (
      <div className={styles.container} style={containerStyle}>
        <div className={styles['caption-container']}>
          <h1 className={clsx('title', styles.caption)}>Vincent Sjögren</h1>
          <h3 className={clsx('title', styles.caption)}>Web developer</h3>
        </div>
        <div
          className={clsx(
            styles['blob-container'],
            loaded && styles.loaded,
            isMobile && styles.mobile
          )}
        >
          <BlobScene onCreated={() => setLoaded(true)} />
        </div>
      </div>
    );
  },
  { id: PageSection.Start, className: styles.section }
);
