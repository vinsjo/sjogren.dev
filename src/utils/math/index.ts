import type { MinMax } from '@/types';

export const getAverage = (values: number[]) => {
  if (!values.length) return 0;

  const sum = values.reduce((sum, value) => sum + (value || 0), 0);

  return sum / values.length;
};

export const randomNumber: (...args: MinMax) => number = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const randomInt: (...args: MinMax) => number = (min, max) => {
  return Math.trunc(randomNumber(max, min));
};

export const randomNegativeNumber = (max: number) => randomNumber(max, -max);
