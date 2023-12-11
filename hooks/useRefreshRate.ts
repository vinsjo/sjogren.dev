import { useState, useEffect, useMemo } from 'react';

import { getAverage } from '@utils/math';

/**
 * inspired by:
 * https://ourcodeworld.com/articles/read/1390/how-to-determine-the-screen-refresh-rate-in-hz-of-the-monitor-with-javascript-in-the-browser
 */
async function getAverageFPS(
  measurementLength: number,
  controller?: AbortController
) {
  if (typeof window === 'undefined' || !measurementLength) return 0;

  const deltas = await new Promise<number[]>((resolve, reject) => {
    if (controller) {
      controller.signal.addEventListener('abort', () => reject('canceled'));
    }
    let current: number | null = null,
      prev: number | null = null;
    let handle: ReturnType<typeof requestAnimationFrame> | null = null;

    const deltas: number[] = [];

    (function animate() {
      handle = requestAnimationFrame(animate);
      [current, prev] = [performance.now(), current];
      if (prev) deltas.push(current - prev);
    })();

    setTimeout(() => {
      cancelAnimationFrame(handle);
      resolve(deltas);
    }, measurementLength);
  });

  const avgDelta = getAverage(...deltas);

  const fps = 1000 / avgDelta || 0;

  return !isFinite(fps) ? 0 : fps;
}

const MAX_STORED_MEASUREMENTS = 20;
/**
 *
 * @param measurementDuration How long each measurement should take, in milliseconds
 * @param measurementCount Maximum amount of measurements, or undefined if measurements should continue indefinitely
 */
const useRefreshRate = (
  measurementDuration = 1000,
  measurementCount?: number
) => {
  const [measurements, setMeasurements] = useState<number[]>([]);
  const [error, setError] = useState<Error | unknown | null>(null);

  const shouldExecute =
    !error && (!measurementCount || measurements.length < measurementCount);

  useEffect(() => {
    if (!shouldExecute) return;

    const controller = new AbortController();

    getAverageFPS(measurementDuration, controller)
      .then((fps) =>
        setMeasurements((prev) => {
          return [...prev, fps].slice(MAX_STORED_MEASUREMENTS - 1);
        })
      )
      .catch((err) => {
        if (err !== 'canceled') {
          setError(err);
        }
      });
    return () => controller.abort();
  }, [shouldExecute, measurementCount, measurementDuration, measurements]);

  return useMemo(() => getAverage(...measurements), [measurements]);
};

export default useRefreshRate;
