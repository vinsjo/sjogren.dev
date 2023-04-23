import { useState, useEffect } from 'react';
import { useUpdateEffect } from 'usehooks-ts';
import { isNum } from 'x-is-type';

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
 * @param measurementDuration How long each measurement should take, in milliseconds
 * @param measurementCount Maximum amount of measurements, or undefined if measurements should continue indefinitely
 */
const useRefreshRate = (
    measurementDuration = 1000,
    measurementCount?: number
) => {
    const [measurements, setMeasurements] = useState<number[]>([]);
    const [error, setError] = useState<Error | unknown | null>(null);
    const [shouldExecute, setShouldExecute] = useState(true);
    const [averageFPS, setAverageFPS] = useState(0);

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
                    console.error(err);
                }
            });
        return () => controller.abort();
    }, [measurementDuration, measurements, shouldExecute]);

    useUpdateEffect(
        () =>
            setShouldExecute(
                !error &&
                    (!measurementCount ||
                        measurements.length < measurementCount)
            ),
        [error, measurementCount, measurements.length]
    );

    useUpdateEffect(() => {
        const sum = measurements.reduce((sum, fps) => sum + fps, 0);
        if (!sum) return;
        const average = Math.round(sum / measurements.length);
        if (!isFinite(average)) return;
        setAverageFPS(average);
    }, [measurements]);

    return averageFPS;
};

export default useRefreshRate;
