export function getSum(...values: number[]) {
  return values.reduce((sum, value) => sum + value || 0, 0);
}

export function getAverage(...values: number[]) {
  if (!values.length) return 0;
  const sum = getSum(...values);
  if (!sum) return 0;

  return sum / values.length;
}

export function rand(max = 1, min = 0) {
  return Math.random() * (max - min) + min;
}
export function rand_int(max = 10, min = 0) {
  return Math.floor(rand(max, min));
}
export function rand_neg(max = 1) {
  return rand(max, -max);
}
