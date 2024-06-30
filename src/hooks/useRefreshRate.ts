import { useEffect, useReducer } from 'react';

import { getAverage } from '@/utils/math';

const MAX_CACHED_MEASUREMENTS = 20;
const CANCELLED_ERROR = 'cancelled';

/**
 * inspired by:
 * https://ourcodeworld.com/articles/read/1390/how-to-determine-the-screen-refresh-rate-in-hz-of-the-monitor-with-javascript-in-the-browser
 */
async function getAverageFPS(
  duration: number,
  controller: AbortController,
): Promise<number> {
  if (typeof window === 'undefined' || duration <= 0) {
    return 0;
  }

  return await new Promise<number>((resolve, reject) => {
    const deltas: number[] = [];

    let prev = 0;
    let current = 0;

    // Animation frame 'handle'
    let animationFrameHandle: number | null = null;

    const resolveAverageFps = () => {
      const avgDelta = getAverage(deltas);
      return resolve(!avgDelta ? 0 : 1000 / avgDelta);
    };

    const cancelAnimation = () => {
      if (animationFrameHandle != null) {
        cancelAnimationFrame(animationFrameHandle);
        animationFrameHandle = null;
      }
    };

    // Enable stopping the animation loop using AbortController
    controller.signal.addEventListener('abort', () => {
      if (animationFrameHandle != null) {
        cancelAnimationFrame(animationFrameHandle);
        animationFrameHandle = null;
      }
      reject(CANCELLED_ERROR);
    });

    function animate() {
      animationFrameHandle = requestAnimationFrame(animate);

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
}

type State = {
  measurements: number[];
  average: number;
  error: boolean;
};

type Action =
  | { type: 'add'; payload: number }
  | { type: 'error'; payload: unknown };

const reducer: React.Reducer<State, Action> = (prevState, action) => {
  if (action.type === 'add') {
    const measurements = [...prevState.measurements, action.payload];

    while (measurements.length > MAX_CACHED_MEASUREMENTS) {
      measurements.shift();
    }

    return { measurements, average: getAverage(measurements), error: false };
  }

  if (action.type === 'error') {
    const error = Boolean(action.payload);
    return prevState.error === error ? prevState : { ...prevState, error };
  }

  return prevState;
};

/**
 *
 * @param measurementDuration How long each measurement should take, in milliseconds.
 * Default is `1000`.
 * @param measurementCount Maximum amount of measurements, default is 10.
 * Default is {@link MAX_CACHED_MEASUREMENTS}.
 */
export const useScreenRefreshRate = (
  measurementDuration = 1000,
  measurementCount = 10,
) => {
  const [state, dispatch] = useReducer(reducer, {
    measurements: [],
    average: 0,
    error: false,
  });

  const shouldExecute =
    !state.error &&
    (measurementCount <= 0 || state.measurements.length < measurementCount);

  useEffect(() => {
    if (!shouldExecute) return;

    const controller = new AbortController();

    getAverageFPS(measurementDuration, controller)
      .then((payload) => dispatch({ type: 'add', payload }))
      .catch((err) => {
        const isCancelled = CANCELLED_ERROR;
        if (import.meta.env.DEV) {
          console.error(isCancelled ? 'FPS Measurement aborted' : err);
        }
        if (!isCancelled && err) {
          dispatch({ type: 'error', payload: err });
        }
      });

    return () => controller.abort();
  }, [shouldExecute, measurementDuration, state.measurements]);

  return state.average;
};
