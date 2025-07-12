import { useEffect, useReducer } from 'react';

import { getAverage } from '@/utils/math';

import { getAverageFPS } from './getAverageFPS';

const MAX_CACHED_MEASUREMENTS = 20;

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
 * @param measurementCount Maximum amount of measurements, default is `10`.
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

    getAverageFPS(measurementDuration, controller.signal)
      .then((payload) => dispatch({ type: 'add', payload }))
      .catch((err) => {
        const isAbortError =
          controller.signal.aborted && err === controller.signal.reason;

        if (import.meta.env.DEV) {
          console.error(isAbortError ? 'FPS Measurement aborted' : err);
        }

        if (!isAbortError && err) {
          dispatch({ type: 'error', payload: err });
        }
      });

    return () => controller.abort();
  }, [shouldExecute, measurementDuration, state.measurements]);

  return state.average;
};
