const STRANDS = [
  { src: "TinselStrands/tinsel_01.png", sx: 30, sw: 97, sh: 548 },
  { src: "TinselStrands/tinsel_02.png", sx: 25, sw: 113, sh: 468 },
  { src: "TinselStrands/tinsel_03.png", sx: 26, sw: 111, sh: 493 },
  { src: "TinselStrands/tinsel_04.png", sx: 32, sw: 96, sh: 633 },
  { src: "TinselStrands/tinsel_05.png", sx: 44, sw: 68, sh: 571 },
  { src: "TinselStrands/tinsel_06.png", sx: 24, sw: 111, sh: 428 },
  { src: "TinselStrands/tinsel_07.png", sx: 43, sw: 73, sh: 486 },
  { src: "TinselStrands/tinsel_08.png", sx: 18, sw: 130, sh: 535 },
  { src: "TinselStrands/tinsel_09.png", sx: 28, sw: 103, sh: 431 },
  { src: "TinselStrands/tinsel_10.png", sx: 42, sw: 76, sh: 509 },
  { src: "TinselStrands/tinsel_11.png", sx: 32, sw: 96, sh: 526 },
  { src: "TinselStrands/tinsel_12.png", sx: 35, sw: 89, sh: 618 },
];

const GRAVITY = 0.05;
const DAMPING = 0.9;
const ITERATIONS = 4;
const STIFFNESS = 0.72;
const RETURN = 0.16;
const MAX_SPEED = 28;

const TOP_BASELINE = 246;
const BOTTOM_BASELINE = 595;
const LETTER_GAP = 22;
const SPACE_WIDTH = 100;
const LINE_GAP = 46;
const MAX_TYPED = 80;

const GLYPHS = {
  a: { outlines: [11], holes: [34], x: 0, top: 83.5, w: 136.9, h: 209, baseline: TOP_BASELINE },
  b: { outlines: [7], holes: [33], x: 171.7, top: 0.8, w: 131.1, h: 244.2, baseline: TOP_BASELINE },
  c: { outlines: [21], holes: [], x: 338.7, top: 83.6, w: 119.4, h: 162.5, baseline: TOP_BASELINE },
  d: { outlines: [3], holes: [30], x: 489, top: 1.6, w: 153.8, h: 244.7, baseline: TOP_BASELINE },
  e: { outlines: [17], holes: [36], x: 672.7, top: 84.4, w: 117.8, h: 162.2, baseline: TOP_BASELINE },
  f: { outlines: [12], holes: [], x: 759.8, top: 0, w: 189.1, h: 332.1, baseline: TOP_BASELINE },
  g: { outlines: [2], holes: [28, 29], x: 907.8, top: 82.8, w: 176.3, h: 249.5, baseline: TOP_BASELINE },
  h: { outlines: [5], holes: [], x: 1109.5, top: 0.9, w: 150.5, h: 243.4, baseline: TOP_BASELINE },
  i: { outlines: [25, 27], holes: [], x: 1299.5, top: 8.4, w: 75.5, h: 237.7, baseline: TOP_BASELINE },
  j: { outlines: [20, 26], holes: [], x: 1375.1, top: 6.6, w: 110, h: 325.8, baseline: TOP_BASELINE },
  k: { outlines: [8], holes: [], x: 1508.6, top: 1.6, w: 144.9, h: 244.1, baseline: TOP_BASELINE },
  l: { outlines: [19], holes: [], x: 1685.3, top: 0.4, w: 70.4, h: 244.2, baseline: TOP_BASELINE },
  m: { outlines: [0], holes: [], x: 1790.9, top: 84.2, w: 236.2, h: 162.1, baseline: TOP_BASELINE },
  n: { outlines: [9], holes: [], x: 2069.2, top: 83.7, w: 161.5, h: 161.9, baseline: TOP_BASELINE },
  o: { outlines: [13], holes: [35], x: 8.9, top: 433.1, w: 130.2, h: 162.7, baseline: BOTTOM_BASELINE },
  p: { outlines: [4], holes: [31], x: 162, top: 433.8, w: 155, h: 250, baseline: BOTTOM_BASELINE },
  q: { outlines: [6], holes: [32], x: 355.3, top: 432.8, w: 133.8, h: 249.5, baseline: BOTTOM_BASELINE },
  r: { outlines: [24], holes: [], x: 517.7, top: 433.8, w: 108.5, h: 156.2, baseline: BOTTOM_BASELINE },
  s: { outlines: [23], holes: [], x: 649.9, top: 432.7, w: 104, h: 158, baseline: BOTTOM_BASELINE },
  t: { outlines: [22], holes: [], x: 777.3, top: 376.2, w: 143.5, h: 217.8, baseline: BOTTOM_BASELINE },
  u: { outlines: [10], holes: [], x: 900.9, top: 434.2, w: 156.7, h: 162.5, baseline: BOTTOM_BASELINE },
  v: { outlines: [14], holes: [], x: 1092.6, top: 432.1, w: 149.9, h: 162.6, baseline: BOTTOM_BASELINE },
  w: { outlines: [1], holes: [], x: 1275.2, top: 432, w: 223.2, h: 162.9, baseline: BOTTOM_BASELINE },
  x: { outlines: [15], holes: [], x: 1527.7, top: 432.7, w: 156.2, h: 163.1, baseline: BOTTOM_BASELINE },
  y: { outlines: [18], holes: [], x: 1647.4, top: 451.7, w: 173.7, h: 274.3, baseline: BOTTOM_BASELINE },
  z: { outlines: [16], holes: [], x: 1849.1, top: 432.5, w: 136.4, h: 160.9, baseline: BOTTOM_BASELINE },
  ".": { punct: true, x: 0, top: 191.07, w: 47.66, h: 54.93, baseline: TOP_BASELINE },
  "!": { punct: true, x: 0, top: 27.42, w: 61.4, h: 218.58, baseline: TOP_BASELINE },
  "?": { punct: true, x: 0, top: 21.62, w: 116.42, h: 224.38, baseline: TOP_BASELINE },
};

const PUNCT_PATHS = {
  ".": "M 46.80 205.31C 50.30 218.39 42.74 239.49 30.34 244.00C 22.53 246.83 10.52 247.41 5.45 240.71C -5.71 225.94 1.46 205.39 15.91 195.62C 21.46 191.89 27.84 189.95 33.98 191.75C 39.56 193.39 45.03 198.71 46.80 205.31Z",
  "!": "M 29.66 27.42L 28.02 34.69L 26.25 41.83L 24.36 48.99L 22.40 56.14L 20.39 63.30L 18.36 70.44L 16.35 77.58L 14.38 84.70L 12.47 91.81L 10.66 98.88L 8.95 105.92L 7.37 112.92L 5.92 119.87L 4.63 126.76L 3.48 133.57L 2.49 140.30L 1.65 146.91L 0.96 153.40L 0.41 159.74L 0.00 165.87L 3.61 159.59L 9.88 155.95L 17.13 155.94L 23.41 159.55L 27.05 165.82L 27.06 173.07L 29.73 167.60L 32.43 161.94L 35.11 156.05L 37.75 149.94L 40.33 143.62L 42.81 137.08L 45.18 130.35L 47.41 123.42L 49.49 116.32L 51.40 109.06L 53.15 101.65L 54.73 94.11L 56.13 86.46L 57.36 78.71L 58.42 70.89L 59.31 63.02L 60.05 55.12L 60.65 47.19L 61.10 39.27L 61.40 31.52L 58.24 39.18L 51.68 44.24L 43.48 45.34L 35.82 42.18L 30.76 35.62ZM 53.67 205.31C 57.17 218.39 49.61 239.49 37.21 244.00C 29.40 246.83 17.39 247.41 12.32 240.71C 1.16 225.94 8.33 205.39 22.78 195.62C 28.33 191.89 34.71 189.95 40.85 191.75C 46.43 193.39 51.90 198.71 53.67 205.31Z",
  "?": "M 36.23 120.68L 34.23 113.72L 32.99 107.54L 32.28 101.66L 32.07 96.10L 32.31 90.89L 32.97 86.04L 33.99 81.59L 35.34 77.56L 36.95 73.94L 38.79 70.77L 40.79 68.03L 42.92 65.72L 45.13 63.83L 47.40 62.33L 49.70 61.19L 52.06 60.38L 54.49 59.87L 57.05 59.66L 59.79 59.76L 62.80 60.23L 65.91 61.06L 68.26 62.07L 70.13 63.22L 71.64 64.48L 72.90 65.87L 73.97 67.45L 74.88 69.26L 75.62 71.35L 76.17 73.74L 76.47 76.42L 76.49 79.39L 76.17 82.61L 75.49 86.03L 74.41 89.62L 72.90 93.33L 70.94 97.13L 68.50 100.95L 65.56 104.77L 62.10 108.53L 57.31 112.85L 54.43 115.71L 51.82 118.45L 49.39 121.16L 47.12 123.84L 45.02 126.49L 43.07 129.11L 41.28 131.70L 39.63 134.26L 38.12 136.78L 36.74 139.26L 35.49 141.70L 34.35 144.09L 33.32 146.44L 32.39 148.73L 31.55 150.97L 30.79 153.16L 30.10 155.30L 29.46 157.39L 28.87 159.43L 28.32 161.43L 32.78 156.40L 39.17 154.27L 45.76 155.63L 50.79 160.09L 52.92 166.48L 51.56 173.07L 52.81 171.47L 54.04 169.90L 55.26 168.37L 56.48 166.87L 57.70 165.40L 58.94 163.95L 60.19 162.52L 61.47 161.10L 62.78 159.67L 64.14 158.24L 65.55 156.79L 67.03 155.31L 68.59 153.80L 70.24 152.24L 71.99 150.63L 73.85 148.96L 75.83 147.23L 77.96 145.42L 80.23 143.53L 82.57 141.65L 88.55 136.68L 94.61 130.66L 99.96 124.28L 104.59 117.60L 108.48 110.67L 111.62 103.53L 114.01 96.26L 115.61 88.89L 116.42 81.47L 116.41 74.08L 115.54 66.76L 113.79 59.60L 111.13 52.69L 107.52 46.15L 102.98 40.13L 97.55 34.76L 91.31 30.19L 84.37 26.54L 76.86 23.88L 69.08 22.27L 61.45 21.62L 53.90 21.93L 46.57 23.20L 39.56 25.39L 32.99 28.43L 26.92 32.26L 21.41 36.79L 16.51 41.93L 12.23 47.60L 8.59 53.73L 5.59 60.27L 3.23 67.15L 1.51 74.34L 0.43 81.80L 0.00 89.49L 0.23 97.38L 1.11 105.43L 2.67 113.63L 4.90 121.94L 7.65 129.82L 7.28 122.07L 10.84 115.16L 17.37 110.96L 25.12 110.59L 32.03 114.15ZM 66.91 205.31C 70.41 218.39 62.85 239.49 50.45 244.00C 42.64 246.83 30.63 247.41 25.56 240.71C 14.40 225.94 21.57 205.39 36.02 195.62C 41.57 191.89 47.95 189.95 54.09 191.75C 59.67 193.39 65.14 198.71 66.91 205.31Z",
};

const canvas = document.querySelector("#letters");
const keyboard = document.querySelector("#keyboard");
const ctx = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let ropes = [];
let letterMask = null;
let viewWidth = 0;
let viewHeight = 0;
let simScale = 1;
let building = false;
let rebuildQueued = false;
let rebuildTimer = 0;
let typed = "";
let keyboardOpen = false;
let caretMark = null;

prepareGlyphs();

function prepareGlyphs() {
  const paths = [...document.querySelectorAll("#letter-source svg path")];
  Object.entries(GLYPHS).forEach(([character, glyph]) => {
    if (glyph.punct) {
      glyph.outlinePaths = [new Path2D(PUNCT_PATHS[character])];
      glyph.holePaths = [];
    } else {
      glyph.outlinePaths = glyph.outlines.map((index) => new Path2D(paths[index].getAttribute("d")));
      glyph.holePaths = glyph.holes.map((index) => new Path2D(paths[index].getAttribute("d")));
    }
    glyph.rise = glyph.baseline - glyph.top;
    glyph.drop = glyph.top + glyph.h - glyph.baseline;
  });
}

function hash(n) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function loadImages() {
  return Promise.all(
    STRANDS.map(
      (strand) =>
        new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve({ ...strand, image });
          image.onerror = () => reject(new Error(`Could not load ${strand.src}`));
          image.src = strand.src;
        })
    )
  );
}

function distanceToOutside(mask, w, h) {
  const INF = 1e15;
  const size = Math.max(w, h);
  const grid = new Float64Array(w * h);
  const f = new Float64Array(size);
  const d = new Float64Array(size);
  const v = new Int32Array(size);
  const z = new Float64Array(size + 1);

  function transform(n) {
    let k = 0;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;

    for (let q = 1; q < n; q += 1) {
      let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) {
        k -= 1;
        if (k < 0) break;
        s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      }
      if (k < 0) k = 0;
      k += 1;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }

    k = 0;
    for (let q = 0; q < n; q += 1) {
      while (z[k + 1] < q) k += 1;
      const r = v[k];
      d[q] = (q - r) * (q - r) + f[r];
    }
  }

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) f[x] = mask[y * w + x] ? INF : 0;
    transform(w);
    for (let x = 0; x < w; x += 1) grid[y * w + x] = d[x];
  }

  const dist = new Float32Array(w * h);
  for (let x = 0; x < w; x += 1) {
    for (let y = 0; y < h; y += 1) f[y] = grid[y * w + x];
    transform(h);
    for (let y = 0; y < h; y += 1) dist[y * w + x] = Math.sqrt(Math.max(0, d[y]));
  }

  return dist;
}

function sample(dist, w, h, x, y) {
  if (x < 0 || y < 0 || x > w - 1 || y > h - 1) return 0;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(w - 1, x0 + 1);
  const y1 = Math.min(h - 1, y0 + 1);
  const tx = x - x0;
  const ty = y - y0;
  const a = dist[y0 * w + x0];
  const b = dist[y0 * w + x1];
  const c = dist[y1 * w + x0];
  const d = dist[y1 * w + x1];
  return a * (1 - tx) * (1 - ty) + b * tx * (1 - ty) + c * (1 - tx) * ty + d * tx * ty;
}

function tangentAt(dist, w, h, x, y, previous) {
  const gx = sample(dist, w, h, x + 1.6, y) - sample(dist, w, h, x - 1.6, y);
  const gy = sample(dist, w, h, x, y + 1.6) - sample(dist, w, h, x, y - 1.6);
  let tx = -gy;
  let ty = gx;
  let length = Math.hypot(tx, ty);

  if (length < 0.08) {
    if (previous) return previous;
    return { x: 1, y: 0 };
  }

  tx /= length;
  ty /= length;

  if (previous && tx * previous.x + ty * previous.y < 0) {
    tx = -tx;
    ty = -ty;
  }

  if (!previous) return { x: tx, y: ty };

  const blendedX = previous.x * 0.62 + tx * 0.38;
  const blendedY = previous.y * 0.62 + ty * 0.38;
  const blended = Math.hypot(blendedX, blendedY) || 1;
  return { x: blendedX / blended, y: blendedY / blended };
}

function cover(covered, w, h, x, y, radius) {
  const r = Math.ceil(radius);
  const x0 = Math.max(0, Math.floor(x) - r);
  const y0 = Math.max(0, Math.floor(y) - r);
  const x1 = Math.min(w - 1, Math.floor(x) + r);
  const y1 = Math.min(h - 1, Math.floor(y) + r);
  const r2 = radius * radius;

  for (let py = y0; py <= y1; py += 1) {
    for (let px = x0; px <= x1; px += 1) {
      const dx = px - x;
      const dy = py - y;
      if (dx * dx + dy * dy <= r2) covered[py * w + px] = 1;
    }
  }
}

function traceCenterline(dist, mask, covered, w, h, x, y, sign) {
  const step = 2.2;
  const points = [];
  let px = x;
  let py = y;
  let direction = null;
  const seen = new Set();

  for (let i = 0; i < 2200; i += 1) {
    const radius = sample(dist, w, h, px, py);
    const ix = Math.round(px);
    const iy = Math.round(py);
    if (radius < 0.9 || ix < 1 || iy < 1 || ix >= w - 1 || iy >= h - 1) break;
    if (!mask[iy * w + ix]) break;

    const key = `${Math.round(px / 2)},${Math.round(py / 2)}`;
    if (i > 1 && seen.has(key)) break;
    seen.add(key);

    points.push({ x: px, y: py, radius });
    cover(covered, w, h, px, py, Math.max(2.6, radius * 1.05));

    direction = tangentAt(dist, w, h, px, py, direction);
    px += direction.x * step * sign;
    py += direction.y * step * sign;
  }

  return points;
}

function smooth(points) {
  if (points.length < 5) return points;
  const smoothed = [points[0]];

  for (let i = 1; i < points.length - 1; i += 1) {
    smoothed.push({
      x: points[i - 1].x * 0.22 + points[i].x * 0.56 + points[i + 1].x * 0.22,
      y: points[i - 1].y * 0.22 + points[i].y * 0.56 + points[i + 1].y * 0.22,
      radius: points[i].radius,
    });
  }

  smoothed.push(points[points.length - 1]);
  return smoothed;
}

function buildRopes(dist, mask, w, h, images) {
  const covered = new Uint8Array(w * h);
  const seeds = [];

  for (let y = 2; y < h - 2; y += 2) {
    for (let x = 2; x < w - 2; x += 2) {
      const i = y * w + x;
      if (mask[i] && dist[i] > 0.75) seeds.push({ x, y, d: dist[i] });
    }
  }

  seeds.sort((a, b) => b.d - a.d);
  const next = [];

  function addStrand(seed, index) {
    if (covered[seed.y * w + seed.x]) return;

    const forward = traceCenterline(dist, mask, covered, w, h, seed.x, seed.y, 1);
    const backward = traceCenterline(dist, mask, covered, w, h, seed.x, seed.y, -1);
    const chain = smooth(backward.reverse().concat(forward.slice(1)));
    if (chain.length < 2) return;

    const strand = images[Math.floor(hash(index + 3) * images.length)];
    const points = chain.map((point, pointIndex) => {
      const span = Math.max(8, point.radius * 4.8);
      return {
        x: point.x,
        y: point.y,
        px: point.x,
        py: point.y,
        rx: point.x,
        ry: point.y,
        span,
        pinned: true,
      };
    });

    next.push({
      image: strand.image,
      sx: strand.sx,
      sw: strand.sw,
      sh: strand.sh,
      phase: hash(index + 19) * strand.sh,
      width: points.reduce((sum, point) => sum + point.span, 0) / points.length,
      depth: hash(index + 23),
      points,
    });
  }

  seeds.forEach(addStrand);

  let gapIndex = seeds.length;
  for (let y = 2; y < h - 2; y += 3) {
    for (let x = 2; x < w - 2; x += 3) {
      const i = y * w + x;
      if (!mask[i] || covered[i] || dist[i] < 1.2) continue;
      addStrand({ x, y, d: dist[i] }, gapIndex);
      gapIndex += 1;
    }
  }
  next.sort((a, b) => a.depth - b.depth);
  return next;
}

function hasInkText() {
  return usableCharacters(typed).some((character) => character !== " " && character !== "\n");
}

function showingSpecimen() {
  return !keyboardOpen && !hasInkText();
}

function usableCharacters(text) {
  return [...text.toLowerCase()].filter((character) => character === "\n" || character === " " || GLYPHS[character]);
}

function wordWidth(glyphs) {
  return glyphs.reduce((sum, glyph, index) => sum + glyph.w + (index ? (glyph.punct ? 14 : LETTER_GAP) : 0), 0);
}

function wrapText(characters, maxWidth) {
  const words = [];
  let word = [];

  characters.forEach((character) => {
    if (character === "\n" || character === " ") {
      if (word.length) words.push(word);
      word = [];
      if (character === "\n") words.push(null);
      return;
    }
    word.push(GLYPHS[character]);
  });
  if (word.length) words.push(word);

  const lines = [];
  let line = [];
  let width = 0;

  function commit() {
    lines.push(line);
    line = [];
    width = 0;
  }

  words.forEach((entry) => {
    if (entry === null) {
      commit();
      return;
    }

    const entryWidth = wordWidth(entry);
    if (line.length && width + SPACE_WIDTH + entryWidth > maxWidth) commit();

    let x = line.length ? width + SPACE_WIDTH : 0;
    entry.forEach((glyph, index) => {
      if (index) x += glyph.punct ? 14 : LETTER_GAP;
      line.push({ glyph, x });
      x += glyph.w;
    });
    width = x;
  });

  if (line.length || !lines.length) lines.push(line);
  return lines;
}

function lineWidth(line) {
  if (!line.length) return 0;
  const last = line[line.length - 1];
  return last.x + last.glyph.w;
}

function composeText(text, boxWidth, boxHeight) {
  const characters = usableCharacters(text);
  const widest = Math.max(...Object.values(GLYPHS).map((glyph) => glyph.w));
  const looseWidth = Math.max(widest, ...wrapText(characters, 1e9).map(lineWidth));
  let best = null;
  const step = Math.max(28, looseWidth / 32);

  for (let maxWidth = widest; maxWidth <= looseWidth + step; maxWidth += step) {
    const lines = wrapText(characters, maxWidth);
    const blockWidth = Math.max(1, ...lines.map(lineWidth));
    lines.forEach((line) => {
      const offset = (blockWidth - lineWidth(line)) / 2;
      line.forEach((item) => {
        item.x += offset;
      });
    });

    let baseline = 0;
    let previousDrop = 0;
    let minY = Infinity;
    let maxY = -Infinity;
    const placed = [];

    lines.forEach((line, index) => {
      const rise = line.reduce((max, item) => Math.max(max, item.glyph.rise), 150);
      const drop = line.reduce((max, item) => Math.max(max, item.glyph.drop), 24);
      if (index > 0) baseline += previousDrop + LINE_GAP + rise;
      line.forEach((item) => {
        const top = baseline - item.glyph.rise;
        minY = Math.min(minY, top);
        maxY = Math.max(maxY, top + item.glyph.h);
        placed.push({ glyph: item.glyph, x: item.x, baseline });
      });
      previousDrop = drop;
    });

    if (!placed.length) {
      minY = -160;
      maxY = 16;
    }

    const lastLine = lines[lines.length - 1];
    const caret = {
      x: lastLine.length ? lineWidth(lastLine) + 18 : blockWidth / 2,
      baseline: baseline,
    };

    const block = {
      placed,
      caret,
      minX: 0,
      minY,
      width: blockWidth,
      height: Math.max(40, maxY - minY),
    };
    const scale = Math.min(boxWidth / block.width, boxHeight / block.height);
    const lineCount = lines.filter((line) => line.length).length || 1;
    const candidate = { ...block, scale, lineCount };
    if (!best || candidate.scale > best.scale * 1.12 || (candidate.lineCount < best.lineCount && candidate.scale > best.scale * 0.9)) {
      best = candidate;
    }
  }

  return best;
}

function fitBox(w, h) {
  const keyboardHeight = keyboardOpen ? keyboard.offsetHeight * simScale : 0;
  return {
    width: w,
    height: Math.max(80, h - keyboardHeight),
  };
}

function rasterizeLetters(w, h) {
  caretMark = null;
  if (showingSpecimen()) return rasterizeSpecimen(w, h);
  if (!hasInkText()) return rasterizeBlank(w, h);
  return rasterizeTyped(w, h);
}

function rasterizeBlank(w, h) {
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const box = fitBox(w, h);
  caretMark = {
    x: w / 2,
    y: box.height / 2 - 70,
    w: 3,
    h: 140,
  };
  return { mask: new Uint8Array(w * h), canvas: maskCanvas };
}

function rasterizeTyped(w, h) {
  const box = fitBox(w, h);
  const padX = w * 0.08;
  const padY = box.height * 0.1;
  const composed = composeText(typed, Math.max(40, w - padX * 2), Math.max(40, box.height - padY * 2));
  const scale = Math.min(
    (w - padX * 2) / composed.width,
    (box.height - padY * 2) / composed.height
  );
  const ox = (w - composed.width * scale) / 2;
  const oy = (box.height - composed.height * scale) / 2;

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
  maskCtx.setTransform(scale, 0, 0, scale, ox - composed.minX * scale, oy - composed.minY * scale);
  maskCtx.fillStyle = "#000";

  composed.placed.forEach((item) => {
    maskCtx.save();
    maskCtx.translate(item.x - item.glyph.x, item.baseline - item.glyph.baseline);
    item.glyph.outlinePaths.forEach((path) => maskCtx.fill(path));
    maskCtx.restore();
  });

  maskCtx.globalCompositeOperation = "destination-out";
  composed.placed.forEach((item) => {
    if (!item.glyph.holePaths.length) return;
    maskCtx.save();
    maskCtx.translate(item.x - item.glyph.x, item.baseline - item.glyph.baseline);
    item.glyph.holePaths.forEach((path) => maskCtx.fill(path));
    maskCtx.restore();
  });

  const caretTop = composed.caret.baseline - 150;
  caretMark = {
    x: ox + (composed.caret.x - composed.minX) * scale,
    y: oy + (caretTop - composed.minY) * scale,
    w: Math.max(2.5, 3.2 * scale),
    h: 158 * scale,
  };

  const pixels = maskCtx.getImageData(0, 0, w, h).data;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < mask.length; i += 1) mask[i] = pixels[i * 4 + 3] > 128 ? 1 : 0;
  return { mask, canvas: maskCanvas };
}

function rasterizeSpecimen(w, h) {
  const svg = document.querySelector("#letter-source svg");
  const [vx, vy, vw, vh] = svg.getAttribute("viewBox").split(/[\s,]+/).map(Number);
  const paths = [...svg.querySelectorAll("path")];

  const padX = w * 0.08;
  const padY = h * 0.1;
  const scale = Math.min((w - padX * 2) / vw, (h - padY * 2) / vh);
  const ox = (w - vw * scale) / 2;
  const oy = (h - vh * scale) / 2;

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
  maskCtx.setTransform(scale, 0, 0, scale, ox - vx * scale, oy - vy * scale);
  maskCtx.fillStyle = "#000";

  paths.forEach((path) => {
    if (path.getAttribute("class") === "cls-1") return;
    maskCtx.fill(new Path2D(path.getAttribute("d")));
  });

  maskCtx.globalCompositeOperation = "destination-out";
  paths.forEach((path) => {
    if (path.getAttribute("class") !== "cls-1") return;
    maskCtx.fill(new Path2D(path.getAttribute("d")));
  });

  const pixels = maskCtx.getImageData(0, 0, w, h).data;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < mask.length; i += 1) mask[i] = pixels[i * 4 + 3] > 128 ? 1 : 0;
  return { mask, canvas: maskCanvas };
}

function requestRebuild() {
  if (building) {
    rebuildQueued = true;
    return;
  }
  rebuild();
  if (rebuildQueued) {
    rebuildQueued = false;
    requestRebuild();
  }
}

function scheduleRebuild(immediate) {
  window.clearTimeout(rebuildTimer);
  if (immediate) requestRebuild();
  else rebuildTimer = window.setTimeout(requestRebuild, 40);
}

function insertText(text) {
  const clean = [...text].filter((character) => {
    const lower = character.toLowerCase();
    return lower === "\n" || lower === " " || GLYPHS[lower];
  }).join("").toLowerCase();
  if (!clean) return;
  typed = (typed + clean).replace(/[ ]{2,}/g, " ").slice(0, MAX_TYPED);
  syncChrome();
  scheduleRebuild(false);
}

function deleteText() {
  typed = [...typed].slice(0, -1).join("");
  syncChrome();
  scheduleRebuild(false);
}

function syncChrome() {
  keyboard.hidden = !keyboardOpen;
}

function setKeyboard(open) {
  keyboardOpen = open;
  syncChrome();
  canvas.setAttribute(
    "aria-label",
    open || /[a-z]/i.test(typed)
      ? `Typing ${typed || "nothing yet"}. Letters are built from tinsel strands.`
      : "Lowercase alphabet built from tinsel strands. Click to type."
  );
  scheduleRebuild(true);
}

function rebuild() {
  if (!window.tinselImages || building || viewWidth < 2 || viewHeight < 2) return;
  building = true;
  const maskWidth = Math.max(2, Math.round(viewWidth * simScale));
  const maskHeight = Math.max(2, Math.round(viewHeight * simScale));

  try {
    const traced = rasterizeLetters(maskWidth, maskHeight);
    letterMask = traced.canvas;
    const dist = distanceToOutside(traced.mask, maskWidth, maskHeight);
    ropes = buildRopes(dist, traced.mask, maskWidth, maskHeight, window.tinselImages);
  } catch (error) {
    console.error(error);
  } finally {
    building = false;
  }
}

function integrate(point) {
  if (point.pinned || reducedMotion) {
    point.x = point.rx;
    point.y = point.ry;
    point.px = point.rx;
    point.py = point.ry;
    return;
  }

  let vx = (point.x - point.px) * DAMPING;
  let vy = (point.y - point.py) * DAMPING;
  vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, vx));
  vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, vy));

  point.px = point.x;
  point.py = point.y;
  point.x += vx;
  point.y += vy + GRAVITY;
  point.x += (point.rx - point.x) * RETURN;
  point.y += (point.ry - point.y) * RETURN;
}

function constrain(a, b) {
  const rest = Math.hypot(b.rx - a.rx, b.ry - a.ry) || 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const diff = ((dist - rest) / dist) * STIFFNESS;

  if (a.pinned && b.pinned) return;

  if (a.pinned) {
    b.x -= dx * diff;
    b.y -= dy * diff;
    return;
  }

  if (b.pinned) {
    a.x += dx * diff;
    a.y += dy * diff;
    return;
  }

  const half = diff * 0.5;
  a.x += dx * half;
  a.y += dy * half;
  b.x -= dx * half;
  b.y -= dy * half;
}

function simulate() {
  ropes.forEach((rope) => {
    rope.points.forEach(integrate);
    for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
      for (let i = 0; i < rope.points.length - 1; i += 1) {
        constrain(rope.points[i], rope.points[i + 1]);
      }
    }
  });
}

function drawRope(rope) {
  const { points, image, sx, sw, sh, width, phase } = rope;
  const slice = sh / (points.length - 1);

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    if (length < 0.4) continue;

    const srcY = (phase + slice * i) % Math.max(1, sh - slice);
    const span = ((a.span || width) + (b.span || width)) / 2;
    const flutterA = tinselFlutter(a.rx, a.ry, i);
    const flutterB = tinselFlutter(b.rx, b.ry, i + 1);

    ctx.save();
    ctx.translate(
      (a.x + b.x) / 2 + (flutterA.x + flutterB.x) / 2,
      (a.y + b.y) / 2 + (flutterA.y + flutterB.y) / 2
    );
    ctx.rotate(Math.atan2(dy, dx) - Math.PI / 2 + (flutterA.lean + flutterB.lean) / 2);
    ctx.drawImage(
      image,
      sx,
      srcY,
      sw,
      slice + 1,
      -span / 2,
      -length / 2,
      span,
      length + 0.8
    );
    ctx.restore();
  }
}

let windVector = { x: 0.2, y: 0.85, strength: 6 };
let windClock = 0;

function blowVector(degrees, metersPerSecond) {
  const radians = (degrees * Math.PI) / 180;
  const speed = Math.max(0, Math.min(metersPerSecond, 16));
  return {
    x: -Math.sin(radians),
    y: Math.cos(radians),
    strength: 4 + speed * 0.85,
  };
}

function tinselFlutter(x, y, index) {
  if (reducedMotion) return { x: 0, y: 0, lean: 0 };

  const along = x * windVector.x + y * windVector.y;
  const gust = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(along * 0.011 - windClock * 0.02));
  const flap = Math.sin(index * 0.9 - windClock * 0.065 + y * 0.02);
  const lift = 0.2 + Math.max(0, flap);
  const amount = windVector.strength * 1.7 * gust * lift;
  const cross = Math.sin(windClock * 0.045 + index * 0.5) * amount * 0.4;

  return {
    x: windVector.x * amount - windVector.y * cross,
    y: windVector.y * amount + windVector.x * cross,
    lean: flap * 0.42 * gust,
  };
}

async function readPlace() {
  try {
    const place = await fetch("https://get.geojs.io/v1/ip/geo.json").then((response) => response.json());
    const lat = Number(place.latitude);
    const lon = Number(place.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon)) return { lat, lon };
  } catch (error) {
    console.error(error);
  }
  return { lat: 40.71, lon: -74.01 };
}

async function loadWind() {
  try {
    const place = await readPlace();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=ms`;
    const data = await fetch(url).then((response) => response.json());
    const current = data.current || {};
    const speed = Number(current.wind_gusts_10m || current.wind_speed_10m || 3);
    const direction = Number(current.wind_direction_10m || 0);
    windVector = blowVector(direction, speed);
  } catch (error) {
    console.error(error);
  }
}

function frame() {
  windClock += 1;
  const dpr = window.tinselDpr || 1;
  ctx.setTransform(dpr / simScale, 0, 0, dpr / simScale, 0, 0);
  ctx.clearRect(0, 0, viewWidth * simScale, viewHeight * simScale);
  ropes.forEach(drawRope);

  if (keyboardOpen && caretMark && (reducedMotion || Math.floor(windClock / 28) % 2 === 0)) {
    ctx.fillStyle = "#2a241c";
    ctx.fillRect(caretMark.x, caretMark.y, caretMark.w, caretMark.h);
  }

  requestAnimationFrame(frame);
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  window.tinselDpr = dpr;
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;
  const longest = Math.max(viewWidth, viewHeight);
  simScale = longest > 1400 ? 1400 / longest : 1;
  canvas.width = Math.round(viewWidth * dpr);
  canvas.height = Math.round(viewHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  rebuild();
}

window.addEventListener("resize", resize);

canvas.addEventListener("click", () => {
  setKeyboard(!keyboardOpen);
});

keyboard.addEventListener("pointerdown", (event) => {
  const key = event.target.closest("button");
  if (!key) return;
  event.preventDefault();
  const value = key.dataset.key;
  if (value === "backspace") deleteText();
  else if (value === "done") setKeyboard(false);
  else insertText(value);
});

window.addEventListener("keydown", (event) => {
  if (!keyboardOpen || event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.key === "Escape") {
    setKeyboard(false);
    return;
  }
  if (event.key === "Backspace") {
    event.preventDefault();
    deleteText();
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    insertText("\n");
    return;
  }
  if (event.key === " ") {
    event.preventDefault();
    insertText(" ");
    return;
  }
  if (GLYPHS[event.key.toLowerCase()]) {
    event.preventDefault();
    insertText(event.key);
  }
});

window.addEventListener("paste", (event) => {
  if (!keyboardOpen) return;
  event.preventDefault();
  insertText(event.clipboardData.getData("text") || "");
});

resize();

loadImages().then((images) => {
  window.tinselImages = images;
  rebuild();
  loadWind();
  window.setInterval(loadWind, 10 * 60 * 1000);
  requestAnimationFrame(frame);
});
