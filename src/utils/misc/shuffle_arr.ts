import { randomInt } from '../math';

export function shuffle_arr<T>(arr: T[]): T[] {
  if (!arr.length) return arr;
  for (let i = arr.length - 1; i > 0; i--) {
    const randomIndex = randomInt(0, i + 1);
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
}
