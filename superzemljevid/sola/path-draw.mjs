/* Poenostavitev prostooročne poti (Douglas–Peucker v metrih). */
export const SIMPLIFY_M = 3;
export const MIN_STROKE_M = 5;
export const SAMPLE_M = 1;

export function distM(a, b) {
  if (!a || !b) return Infinity;
  const lat = ((a[1] + b[1]) / 2) * Math.PI / 180;
  const dx = (a[0] - b[0]) * 111320 * Math.cos(lat);
  const dy = (a[1] - b[1]) * 111320;
  return Math.hypot(dx, dy);
}

export function distToSegM(p, a, b) {
  const lat = ((a[1] + b[1] + p[1]) / 3) * Math.PI / 180;
  const kx = 111320 * Math.cos(lat), ky = 111320;
  const ax = a[0] * kx, ay = a[1] * ky;
  const bx = b[0] * kx, by = b[1] * ky;
  const px = p[0] * kx, py = p[1] * ky;
  const vx = bx - ax, vy = by - ay;
  const len2 = vx * vx + vy * vy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * vx + (py - ay) * vy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * vx), py - (ay + t * vy));
}

export function douglasPeucker(points, epsilonM = SIMPLIFY_M) {
  if (!points || points.length <= 2) return (points || []).slice();
  let maxD = -1, idx = -1;
  const first = points[0], last = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = distToSegM(points[i], first, last);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > epsilonM && idx > 0) {
    const left = douglasPeucker(points.slice(0, idx + 1), epsilonM);
    const right = douglasPeucker(points.slice(idx), epsilonM);
    return left.slice(0, -1).concat(right);
  }
  return [first, last];
}

export function strokeLengthM(points) {
  let n = 0;
  for (let i = 1; i < (points || []).length; i++) n += distM(points[i - 1], points[i]);
  return n;
}

export function flattenStrokes(strokes) {
  const out = [];
  for (const s of strokes || []) {
    for (const p of s) {
      const last = out[out.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
    }
  }
  return out;
}
