import { useState, useEffect, useMemo } from 'react';
import { isNum } from 'x-is-type/callbacks';

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
            controller.signal.addEventListener('abort', () =>
                reject('canceled')
            );
        }
        let current: number, prev: number;
        const deltas: number[] = [];
        let handle: number | null = null;
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
    const avgDelta =
        deltas.reduce((sum, d) => {
            return sum + d;
        }, 0) / deltas.length;
    const fps = 1000 / avgDelta;
    return !fps || !isNum(fps) || !isFinite(fps) ? 0 : fps;
}

const MAX_STORED_MEASUREMENTS = 20;
/**
 *
 * @param measurementLength How long each measurement should take, in milliseconds
 * @param measurementCount Maximum amount of measurements, or undefined if measurements should continue indefinitely
 */
const useRefreshRate = (
    measurementLength = 1000,
    measurementCount?: number
) => {
    const [measurements, setMeasurements] = useState<number[]>([]);
    const [error, setError] = useState<Error | unknown | null>(null);
    const execute = useMemo(() => {
        return (
            !error &&
            (!measurementCount ||
                (isNum(measurementCount) &&
                    measurements.length < measurementCount))
        );
    }, [error, measurements, measurementCount]);

    useEffect(() => {
        if (!execute) return;
        const controller = new AbortController();
        getAverageFPS(measurementLength, controller)
            .then((fps) => {
                if (!fps || !isNum(fps) || !isFinite(fps)) return;
                setMeasurements((prev) => {
                    return [...prev, fps].slice(MAX_STORED_MEASUREMENTS - 1);
                });
            })
            .catch((err) => {
                if (err !== 'canceled') {
                    setError(err);
                    console.error(err);
                }
            });
        return () => controller.abort();
    }, [measurementLength, measurements, execute]);

    return useMemo(() => {
        if (!measurements.length) return 0;
        const sum = measurements.reduce((sum, fps) => sum + fps, 0);
        if (!sum) return 0;
        const avg = Math.round(sum / measurements.length);
        return !avg || !isFinite(avg) || !isNum(avg) ? 0 : avg;
    }, [measurements]);
};

export default useRefreshRate;
