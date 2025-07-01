// https://stackoverflow.com/a/61767843
export function matmul(a, b) {
  const transpose = (a) => a[0].map((x, i) => a.map((y) => y[i]));
  const dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
  const result = (a, b) => a.map((x) => transpose(b).map((y) => dotproduct(x, y)));
  return result(a, b);
}