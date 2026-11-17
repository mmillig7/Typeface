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

const canvas = document.querySelector("#letters");
const ctx = canvas.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let ropes = [];
let letterMask = null;
let viewWidth = 0;
let viewHeight = 0;
let simScale = 1;
let building = false;

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

function rasterizeLetters(w, h) {
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

resize();

loadImages().then((images) => {
  window.tinselImages = images;
  rebuild();
  loadWind();
  window.setInterval(loadWind, 10 * 60 * 1000);
  requestAnimationFrame(frame);
});
