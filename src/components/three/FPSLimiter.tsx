import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useEventCallback } from 'usehooks-ts';

import { useScreenRefreshRate } from '@/hooks/useScreenRefreshRate';

import { clamp } from '@/utils/math';

type Props = {
  /**
   * FPS limit
   *
   * If this is 0 or less, animation will be disabled.
   */
  limit: number;
  /**
   * Set to true to disable animation.
   */
  disableAnimation?: boolean;
};

const getFpsLimit = (limit: number, maxFps: number) => {
  if (!maxFps) return Math.max(0, limit);
  return clamp(limit, 0, maxFps);
};

/* based on: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/
export const FPSLimiter: React.FC<Props> = ({
  limit: limitProp,
  disableAnimation = false,
}) => {
  const { frameloop, setFrameloop, clock, invalidate } = useThree();

  const refreshRate = useScreenRefreshRate(500);

  const handleUpdate = useEventCallback(
    (fpsLimit: number, disableAnimation: boolean): (() => void) | void => {
      if (!fpsLimit || disableAnimation) {
        // Set frameloop to never to disable animation
        frameloop !== 'never' && setFrameloop('never');
        return;
      }

      // Set frameloop to demand to manually the frame rate of the animation
      if (frameloop !== 'demand') {
        setFrameloop('demand');
      }

      // How often to re-render (FPS converted to ms)
      const interval = 1 / fpsLimit;

      // Time since last frame
      let delta = 0;
      let animationRequestHandle = 0;

      function animate() {
        animationRequestHandle = window.requestAnimationFrame(animate);
        delta += clock.getDelta();
        if (delta > interval) {
          invalidate();
          delta = delta % interval;
        }
      }

      animate();

      // Return a cleanup function to cancel the animation frame
      return () => window.cancelAnimationFrame(animationRequestHandle);
    },
  );

  useEffect(
    () => handleUpdate(getFpsLimit(limitProp, refreshRate), disableAnimation),
    [handleUpdate, disableAnimation, limitProp, refreshRate],
  );

  return null;
};

export default FPSLimiter;
