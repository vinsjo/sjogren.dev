import { CSSProperties, useState } from 'react';
import { useUpdateEffect } from 'usehooks-ts';
import dynamic from 'next/dynamic';

import { createSection } from './Section';

import { withClientRender } from '@/components/utilities/ClientRender';
import { classNames } from '@/utils/react';

import { useIsMobile } from '@/stores/deviceType';

import {
  useWindowSizeStore,
  selectors as windowSizeSelectors,
} from '@/stores/windowSizeStore';

import { WindowSize } from '@/utils/misc';

import styles from './Start.module.css';
import { PageSection } from './constants';

const BlobScene = withClientRender(
  dynamic(() => import('@/components/three/BlobScene'), {
    ssr: false,
    suspense: true,
  }),
  { withSuspense: true }
);

const getContainerStyle = (
  isMobile: boolean,
  windowSize: WindowSize
): CSSProperties | undefined => {
  const { innerWidth, innerHeight } = windowSize;
  if (!isMobile || !innerWidth || !innerHeight) return;
  return { maxWidth: innerWidth, maxHeight: innerHeight };
};

export const Start = createSection(
  () => {
    const windowSize = useWindowSizeStore(windowSizeSelectors.windowSize);
    const isMobile = useIsMobile();

    const [containerStyle, setContainerStyle] = useState(() =>
      getContainerStyle(isMobile, windowSize)
    );

    useUpdateEffect(() => {
      const next = getContainerStyle(isMobile, windowSize);
      setContainerStyle((prev) => {
        if (
          prev?.maxHeight === next?.maxHeight &&
          prev?.maxWidth === next?.maxHeight
        ) {
          return prev;
        }
        return next;
      });
    }, [isMobile, windowSize]);

    const [loaded, setLoaded] = useState(false);
    return (
      <div className={styles.container} style={containerStyle}>
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
          <BlobScene onCreated={() => setLoaded(true)} />
        </div>
      </div>
    );
  },
  { id: PageSection.Start, className: styles.section }
);
