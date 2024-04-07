import { useEffect } from 'react';
import { useThree, RootState } from '@react-three/fiber';

import useRefreshRate from '@/hooks/useRefreshRate';

type Props = { limit: number; children: React.ReactNode };

const selectors = {
  frameloop: (state) => state.frameloop,
  setFrameloop: (state) => state.setFrameloop,
  clock: (state) => state.clock,
  invalidate: (state) => state.invalidate,
} satisfies Partial<{
  [K in keyof RootState]: (state: RootState) => RootState[K];
}>;

const getLimit = (limit: number, maxFps: number) => {
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

  const maxFps = useRefreshRate(500);

  useEffect(() => {
    const limit = getLimit(limitProp, maxFps);

    if (!limit) {
      frameloop !== 'never' && setFrameloop('never');
      return;
    }

    if (frameloop !== 'demand') {
      setFrameloop('demand');
    }

    const interval = 1 / limit;

    let delta = 0;
    let animationID = 0;

    function update() {
      animationID = requestAnimationFrame(update);
      delta += clock.getDelta();
      if (delta <= interval) return;
      invalidate();
      delta = delta % interval;
    }

    update();

    return () => cancelAnimationFrame(animationID);
  }, [limitProp, maxFps, frameloop, clock, invalidate, setFrameloop]);

  return <>{children}</>;
};

export default FPSLimiter;
