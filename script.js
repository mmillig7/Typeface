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
  t: { outlines: [22], holes: [], x: 777.3, top: 376.2, w: 83.5, h: 217.8, baseline: BOTTOM_BASELINE },
  u: { outlines: [10], holes: [], x: 900.9, top: 434.2, w: 156.7, h: 162.5, baseline: BOTTOM_BASELINE },
  v: { outlines: [14], holes: [], x: 1092.6, top: 432.1, w: 149.9, h: 162.6, baseline: BOTTOM_BASELINE },
  w: { outlines: [1], holes: [], x: 1275.2, top: 432, w: 223.2, h: 162.9, baseline: BOTTOM_BASELINE },
  x: { outlines: [15], holes: [], x: 1527.7, top: 432.7, w: 156.2, h: 163.1, baseline: BOTTOM_BASELINE },
  y: { outlines: [18], holes: [], x: 1647.4, top: 451.7, w: 173.7, h: 274.3, baseline: BOTTOM_BASELINE },
  z: { outlines: [16], holes: [], x: 1849.1, top: 432.5, w: 136.4, h: 160.9, baseline: BOTTOM_BASELINE },
};

const canvas = document.querySelector("#letters");
const keyboard = document.querySelector("#keyboard");
const typeHint = document.querySelector("#type-hint");
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
  Object.values(GLYPHS).forEach((glyph) => {
    glyph.outlinePaths = glyph.outlines.map((index) => new Path2D(paths[index].getAttribute("d")));
    glyph.holePaths = glyph.holes.map((index) => new Path2D(paths[index].getAttribute("d")));
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

function showingSpecimen() {
  return !keyboardOpen && !/[a-z]/i.test(typed);
}

function usableCharacters(text) {
  return [...text.toLowerCase()].filter((character) => character === "\n" || character === " " || GLYPHS[character]);
}

function wordWidth(glyphs) {
  return glyphs.reduce((sum, glyph, index) => sum + glyph.w + (index ? LETTER_GAP : 0), 0);
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
      if (index) x += LETTER_GAP;
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
  if (!/[a-z]/i.test(typed)) return rasterizeBlank(w, h);
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
  typeHint.hidden = keyboardOpen || /[a-z]/i.test(typed);
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
  if (/^[a-z]$/i.test(event.key)) {
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
