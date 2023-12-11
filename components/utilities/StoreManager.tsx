import { useCallback, useEffect, useState } from 'react';
import { useDebounce, useEventListener, useMediaQuery } from 'usehooks-ts';

import { getWindowSize, getScreenSize, getDeviceType } from '@utils/misc';

import { useWindowSizeStore } from 'stores/windowSizeStore';
import { useOrientationStore } from 'stores/orientationStore';
import { useDeviceTypeStore } from 'stores/deviceType';

const { setWindowSize, setScreenSize } = useWindowSizeStore.getState();
const { setOrientation } = useOrientationStore.getState();
const { setDeviceType } = useDeviceTypeStore.getState();

const StoreManager: React.FC = () => {
  const [currentWindowSize, setCurrentWindowSize] = useState(getWindowSize);

  const debouncedWindowSize = useDebounce(currentWindowSize);

  const handleResize = useCallback(
    () => setCurrentWindowSize(getWindowSize()),
    []
  );

  const isPortrait = useMediaQuery('(orientation:portrait)');

  useEventListener('resize', handleResize);

  useEffect(
    () => setOrientation(isPortrait ? 'portrait' : 'landscape'),
    [isPortrait]
  );

  useEffect(handleResize, [handleResize]);
  useEffect(() => setWindowSize(debouncedWindowSize), [debouncedWindowSize]);

  useEffect(() => setScreenSize(getScreenSize()), []);
  useEffect(() => setDeviceType(getDeviceType()), []);

  return <></>;
};

export default StoreManager;
