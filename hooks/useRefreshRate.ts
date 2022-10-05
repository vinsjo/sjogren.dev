import { useState, useEffect, useMemo, useRef } from 'react';
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
/**
 *
 * @param measurementLength How long each measurement should take, in milliseconds
 * @param measurementCount Maximum amount of measurements, or null if measurements should continue indefinitely
 */
const useRefreshRate = (
    measurementLength = 1000,
    measurementCount: number | null
) => {
    const [measurements, setMeasurements] = useState<number[]>([]);
    const [error, setError] = useState<Error | unknown | null>(null);
    const avgFPS = useMemo(() => {
        const sum = measurements.reduce((sum, fps) => sum + fps, 0);
        if (!sum) return 0;
        const avg = Math.round(sum / measurements.length);
        return !avg || !isFinite(avg) || !isNum(avg) ? 0 : avg;
    }, [measurements]);

    useEffect(() => {
        if (
            error ||
            (isNum(measurementCount) && measurements.length >= measurementCount)
        ) {
            return;
        }
        const controller = new AbortController();
        getAverageFPS(measurementLength, controller)
            .then((fps) => {
                if (!fps || !isNum(fps) || !isFinite(fps)) return;
                setMeasurements((prev) => {
                    const next = [...prev, fps];
                    if (next.length > 20) next.shift();
                    return next;
                });
            })
            .catch((err) => {
                if (err !== 'canceled') {
                    setError(err);
                    console.error(err);
                }
            });
        return () => controller.abort();
    }, [measurementLength, measurementCount, measurements, error]);

    return avgFPS;
};

export default useRefreshRate;
