import { getAverage } from '@/utils/math';

/**
 * inspired by:
 * https://ourcodeworld.com/articles/read/1390/how-to-determine-the-screen-refresh-rate-in-hz-of-the-monitor-with-javascript-in-the-browser
 */
export const getAverageFPS = async (
  duration: number,
  signal?: AbortSignal,
): Promise<number> => {
  if (typeof window === 'undefined' || duration <= 0) {
    return 0;
  }

  return await new Promise<number>((resolve, reject) => {
    const deltas: number[] = [];

    let prev = 0;
    let current = 0;

    // Animation frame 'handle'
    let animationFrameHandle: number | null = null;

    const cancelAnimation = () => {
      if (animationFrameHandle != null) {
        window.cancelAnimationFrame(animationFrameHandle);
        animationFrameHandle = null;
      }
    };

    let removeAbortListener: (() => void) | null = null;

    const resolveAverageFps = () => {
      if (removeAbortListener) {
        removeAbortListener();
        removeAbortListener = null;
      }
      const avgDelta = getAverage(deltas);
      return resolve(avgDelta && 1000 / avgDelta);
    };

    // Enable stopping the animation loop using AbortSignal
    if (signal) {
      const handleAbort = () => {
        cancelAnimation();
        reject(signal?.reason);
      };
      signal.addEventListener('abort', handleAbort);

      removeAbortListener = () => {
        signal.removeEventListener('abort', handleAbort);
      };
    }

    function animate() {
      animationFrameHandle = window.requestAnimationFrame(animate);

      [current, prev] = [performance.now(), current];

      if (prev) {
        deltas.push(current - prev);
      }
    }

    animate();

    setTimeout(() => {
      cancelAnimation();
      resolveAverageFps();
    }, duration);
  });
};
