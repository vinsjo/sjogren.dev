import { useEffect } from 'react';
import { useThree, type RootState } from '@react-three/fiber';

import { useScreenRefreshRate } from '@/hooks/useScreenRefreshRate/index';
import useEventCallback from '@mui/utils/useEventCallback';

type Props = {
  /**
   * FPS limit
   *
   * Set to 0 or less to disable FPS limiting.
   */
  limit: number;
  children: React.ReactNode;
};

const selectors = {
  frameloop: (state) => state.frameloop,
  setFrameloop: (state) => state.setFrameloop,
  clock: (state) => state.clock,
  invalidate: (state) => state.invalidate,
} satisfies Partial<{
  [K in keyof RootState]: (state: RootState) => RootState[K];
}>;

const getFpsLimit = (limit: number, maxFps: number) => {
  if (!limit || limit < 0) return 0;
  if (!maxFps) return limit;
  return Math.min(limit, maxFps);
};

/* based on: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/
export const FPSLimiter: React.FC<Props> = ({ limit: limitProp, children }) => {
  const frameloop = useThree(selectors.frameloop);
  const setFrameloop = useThree(selectors.setFrameloop);
  const clock = useThree(selectors.clock);
  const invalidate = useThree(selectors.invalidate);

  const refreshRate = useScreenRefreshRate(500);

  const handleUpdate = useEventCallback((fpsLimit: number): (() => void) => {
    if (!fpsLimit) {
      frameloop !== 'never' && setFrameloop('never');
      return () => {};
    }

    if (frameloop !== 'demand') {
      setFrameloop('demand');
    }

    const interval = 1 / fpsLimit;

    let delta = 0;
    let animationID = 0;

    function update() {
      animationID = window.requestAnimationFrame(update);
      delta += clock.getDelta();
      if (delta <= interval) return;
      invalidate();
      delta = delta % interval;
    }

    update();

    return () => window.cancelAnimationFrame(animationID);
  });

  useEffect(
    () => handleUpdate(getFpsLimit(limitProp, refreshRate)),
    [handleUpdate, limitProp, refreshRate],
  );

  return <>{children}</>;
};

export default FPSLimiter;
