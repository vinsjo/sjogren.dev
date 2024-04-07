import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { getWindowSize, getScreenSize, getDeviceType } from '@/utils/misc';

import {
  useWindowSizeStore,
  selectors as windowSizeStoreSelectors,
} from 'stores/windowSizeStore';
import {
  useOrientationStore,
  selectors as orientationSelectors,
} from 'stores/orientationStore';
import {
  useDeviceTypeStore,
  selectors as deviceTypeSelectors,
} from 'stores/deviceType';

export const StoreManager: React.FC = () => {
  const setWindowSize = useWindowSizeStore(
    windowSizeStoreSelectors.setWindowSize
  );
  const setScreenSize = useWindowSizeStore(
    windowSizeStoreSelectors.setScreenSize
  );
  const setOrientation = useOrientationStore(
    orientationSelectors.setOrientation
  );
  const setDeviceType = useDeviceTypeStore(deviceTypeSelectors.setDeviceType);

  const isPortrait = useMediaQuery('(orientation:portrait)');

  useEffect(
    () => setOrientation(isPortrait ? 'portrait' : 'landscape'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPortrait]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setScreenSize(getScreenSize()), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setDeviceType(getDeviceType()), []);

  useEffect(() => {
    const updateWindowSize = () => setWindowSize(getWindowSize());

    updateWindowSize();

    let timeout: number | null = null;

    const clearTimeout = () => {
      if (timeout != null) {
        window.clearTimeout(timeout);
        timeout = null;
      }
    };

    const onResize = () => {
      clearTimeout();

      timeout = window.setTimeout(() => {
        updateWindowSize();
        timeout = null;
      }, 250);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
