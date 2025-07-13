import type { WH } from '@/types';

export const getWindow: () => Partial<Window> =
  typeof window === 'undefined' ? () => ({}) : () => window;

export const getScreenSize = (): WH => {
  const { width = 0, height = 0 } = getWindow().screen ?? {};
  return { width, height };
};
