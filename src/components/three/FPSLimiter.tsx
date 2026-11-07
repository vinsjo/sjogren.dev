import { useEffect, useEffectEvent } from 'react';
import { useThree } from '@react-three/fiber';

type Props = {
  /**
   * Max FPS to render at.
   */
  limit: number;
  /**
   * Set to true to disable animation.
   */
  disableAnimation?: boolean;
};

/* based on: 
    https://github.com/pmndrs/react-three-fiber/discussions/667#discussioncomment-3026830
*/
export const FPSLimiter: React.FC<Props> = ({
  limit: limitProp,
  disableAnimation = false,
}) => {
  const { frameloop, setFrameloop, invalidate } = useThree();

  const handleFrameLoop = useEffectEvent(
    (fpsLimit: number, disableAnimation: boolean): (() => void) | void => {
      if (fpsLimit <= 0 || disableAnimation) {
        // Set frameloop to never to disable animation loop
        if (frameloop !== 'never') setFrameloop('never');
        return;
      }
      // Set frameloop to demand to take manual control over animation loop
      if (frameloop !== 'demand') setFrameloop('demand');

      // FPS limit converted to frame time in ms
      const frameTimeMs = 1000 / fpsLimit;

      let last = 0;
      let animationRequestHandle = 0;

      const animate: FrameRequestCallback = (now) => {
        animationRequestHandle = window.requestAnimationFrame(animate);
        const delta = now - last;
        if (delta > frameTimeMs) {
          // Call invalidate to render a new frame
          invalidate();
          last = now - (delta % frameTimeMs);
        }
      };
      animationRequestHandle = window.requestAnimationFrame(animate);
      return () => window.cancelAnimationFrame(animationRequestHandle);
    },
  );

  useEffect(
    () => handleFrameLoop(limitProp, disableAnimation),
    [limitProp, disableAnimation],
  );

  return null;
};

export default FPSLimiter;
