/**
 * Генератор иконок «от руки».
 *
 * Рисовать полсотни иконок вручную — недели работы и неизбежный разнобой.
 * Вместо этого берём готовую геометрию (lucide для интерфейсных иконок,
 * собственные контуры для декоративных) и прогоняем её через rough.js —
 * библиотеку, которая имитирует рисунок от руки: каждая линия проводится
 * дважды с лёгким промахом, прямые слегка выгибаются, углы перелетают.
 * Ровно то, что видно на образце заказчика.
 *
 * Работает на этапе сборки: на выходе статичные SVG-пути в JSON, в браузер
 * rough.js не попадает.
 *
 *   node scripts/make-sketch-icons.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import rough from 'roughjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lucideDir = path.join(root, 'node_modules/lucide-react/dist/esm');
const outFile = path.join(root, 'src/components/icons/sketch-paths.json');

const generator = rough.generator();

/* ------------------------------------------------------------------ *
 * Интерфейсные иконки — геометрия берётся из lucide-react (лицензия ISC)
 * ------------------------------------------------------------------ */

/** Карта «имя экспорта → файл» из индекса lucide. */
function lucideFileMap() {
  const index = fs.readFileSync(path.join(lucideDir, 'lucide-react.js'), 'utf8');
  const map = new Map();
  for (const line of index.split('\n')) {
    const m = line.match(/^export \{(.+)\} from '\.\/icons\/(.+)\.js';$/);
    if (!m) continue;
    for (const part of m[1].split(',')) {
      const name = part.trim().match(/^default as (\w+)$/);
      if (name) map.set(name[1], m[2]);
    }
  }
  return map;
}

const files = lucideFileMap();

/** Примитивы иконки: [['path', {d}], ['circle', {cx, cy, r}], ...]. */
function lucideShapes(exportName) {
  const file = files.get(exportName);
  if (!file) throw new Error(`В lucide нет иконки ${exportName}`);
  const src = fs.readFileSync(path.join(lucideDir, 'icons', `${file}.js`), 'utf8');
  const start = src.indexOf('createLucideIcon(');
  const open = src.indexOf('[', start);
  const close = src.lastIndexOf(']);');
  if (start < 0 || open < 0 || close < 0) throw new Error(`Не разобрать ${file}.js`);
  return new Function(`return ${src.slice(open, close + 1)}`)();
}

/* ------------------------------------------------------------------ *
 * Декоративные иконки — собственные контуры, 48×48
 * ------------------------------------------------------------------ */

const decorative = {
  factory: [
    ['path', { d: 'M8 41V22l10 6V22l10 6V13l12 5v23z' }],
    ['path', { d: 'M5 41h38' }],
    ['path', { d: 'M14 41v-6h5v6' }],
    ['path', { d: 'M26 41v-6h5v6' }],
  ],
  design: [
    ['path', { d: 'M10 39V11a2 2 0 0 1 2-2h16l8 8v22a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z' }],
    ['path', { d: 'M28 9v8h8' }],
    ['path', { d: 'M16 24h12' }],
    ['path', { d: 'M16 30h9' }],
  ],
  assembly: [
    ['path', { d: 'M31 9l-6 6 8 8 6-6a9 9 0 0 1-8-8z' }],
    ['path', { d: 'M25 15L9 31a3 3 0 0 0 4 4l16-16' }],
    ['path', { d: 'M35 34h6' }],
    ['path', { d: 'M38 31v6' }],
  ],
  quality: [
    ['path', { d: 'M24 6l14 6v11c0 9-6 16-14 19-8-3-14-10-14-19V12z' }],
    ['path', { d: 'M17 24l5 5 10-10' }],
  ],
  package: [
    ['path', { d: 'M24 7l16 8v18l-16 8-16-8V15z' }],
    ['path', { d: 'M8 15l16 8 16-8' }],
    ['path', { d: 'M24 23v18' }],
  ],
  truck: [
    ['path', { d: 'M4 33V14h20v19' }],
    ['path', { d: 'M24 20h8l6 7v6' }],
    ['path', { d: 'M4 33h5M17 33h8M33 33h6' }],
    ['circle', { cx: 13, cy: 35, r: 3.5 }],
    ['circle', { cx: 35, cy: 35, r: 3.5 }],
  ],
  flame: [
    [
      'path',
      {
        d: 'M24 5c1 7-6 9-6 16a6 6 0 0 0 12 0c0-3-1-5-2-7 4 2 8 6 8 12a12 12 0 0 1-24 0C12 17 21 15 24 5z',
      },
    ],
  ],
  remote: [
    ['path', { d: 'M21 5h6a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4z' }],
    ['circle', { cx: 24, cy: 14, r: 3 }],
    ['path', { d: 'M20 24h8' }],
    ['path', { d: 'M20 30h8' }],
    ['path', { d: 'M20 36h8' }],
  ],
  support: [
    ['path', { d: 'M10 28v-5a14 14 0 0 1 28 0v5' }],
    ['path', { d: 'M10 26h4v11h-4a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3z' }],
    ['path', { d: 'M38 26h-4v11h4a3 3 0 0 0 3-3v-5a3 3 0 0 0-3-3z' }],
    ['path', { d: 'M34 37v2a4 4 0 0 1-4 4h-5' }],
  ],
  shield: [
    ['path', { d: 'M24 6l14 6v11c0 9-6 16-14 19-8-3-14-10-14-19V12z' }],
    ['path', { d: 'M24 17v12' }],
    ['path', { d: 'M24 33.5v.5' }],
  ],
  palette: [
    [
      'path',
      {
        d: 'M24 7c10 0 18 7 18 15 0 5-4 8-8 8h-3a4 4 0 0 0-3 6.5c1 1.5 0 4.5-4 4.5C13 41 6 33 6 23 6 14 14 7 24 7z',
      },
    ],
    ['circle', { cx: 16, cy: 18, r: 2.4 }],
    ['circle', { cx: 25, cy: 14, r: 2.4 }],
    ['circle', { cx: 33, cy: 19, r: 2.4 }],
  ],
  plug: [
    ['path', { d: 'M18 6v10' }],
    ['path', { d: 'M30 6v10' }],
    ['path', { d: 'M12 16h24v6a12 12 0 0 1-24 0z' }],
    ['path', { d: 'M24 34v8' }],
  ],
};

/* ------------------------------------------------------------------ *
 * Интерфейсные иконки: ключ на сайте → имя в lucide
 * ------------------------------------------------------------------ */

const ui = {
  check: 'Check',
  'check-circle': 'CheckCircle2',
  'alert-circle': 'AlertCircle',
  'alert-triangle': 'AlertTriangle',
  info: 'Info',
  x: 'X',
  'arrow-right': 'ArrowRight',
  'arrow-left': 'ArrowLeft',
  'chevron-right': 'ChevronRight',
  minus: 'Minus',
  plus: 'Plus',
  'image-off': 'ImageOff',
  loader: 'Loader2',
  printer: 'Printer',
  'phone-call': 'PhoneCall',
  calculator: 'Calculator',
  cart: 'ShoppingCart',
  quote: 'Quote',
  pause: 'Pause',
  play: 'Play',
  search: 'Search',
  'search-x': 'SearchX',
  heart: 'Heart',
  menu: 'Menu',
  phone: 'Phone',
  mail: 'Mail',
  'map-pin': 'MapPin',
  clock: 'Clock',
  trash: 'Trash2',
  'message-circle': 'MessageCircle',
  'message-plus': 'MessageSquarePlus',
  sliders: 'SlidersHorizontal',
  'package-search': 'PackageSearch',
  package: 'Package',
  truck: 'Truck',
};

/** Заливка штриховкой — как на образце, где фигуры «заштрихованы» ручкой. */
const filled = { 'heart-filled': 'Heart' };

/* ------------------------------------------------------------------ *
 * Огрубление
 * ------------------------------------------------------------------ */

/**
 * Стабильный номер для seed: одна и та же иконка при каждом запуске
 * получает один и тот же «почерк», иначе диффы были бы шумом.
 */
const seedOf = (key) => {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return h + 1;
};

/**
 * rough.js печатает координаты с полной точностью double — это ~2/3 веса
 * файла. При viewBox 24 одна десятая единицы это меньше десятой пикселя,
 * так что округление незаметно, а JSON худеет втрое.
 */
const trim = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));

function roughen(shapes, options) {
  const strokes = [];
  const hatches = [];

  for (const [tag, attrs] of shapes) {
    let drawable;
    const num = (v) => Number(v);
    if (tag === 'path') drawable = generator.path(attrs.d, options);
    else if (tag === 'circle')
      drawable = generator.circle(num(attrs.cx), num(attrs.cy), num(attrs.r) * 2, options);
    else if (tag === 'ellipse')
      drawable = generator.ellipse(
        num(attrs.cx),
        num(attrs.cy),
        num(attrs.rx) * 2,
        num(attrs.ry) * 2,
        options,
      );
    else if (tag === 'rect')
      drawable = generator.rectangle(
        num(attrs.x),
        num(attrs.y),
        num(attrs.width),
        num(attrs.height),
        options,
      );
    else if (tag === 'line')
      drawable = generator.line(
        num(attrs.x1),
        num(attrs.y1),
        num(attrs.x2),
        num(attrs.y2),
        options,
      );
    else if (tag === 'polyline' || tag === 'polygon') {
      const pts = attrs.points
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      const pairs = [];
      for (let i = 0; i < pts.length; i += 2) pairs.push([pts[i], pts[i + 1]]);
      drawable = tag === 'polygon' ? generator.polygon(pairs, options) : generator.linearPath(pairs, options);
    } else throw new Error(`Неизвестный примитив: ${tag}`);

    for (const set of drawable.sets) {
      const d = trim(generator.opsToPath(set));
      if (set.type === 'path') strokes.push(d);
      else if (set.type === 'fillSketch') hatches.push(d);
    }
  }

  return { strokes, hatches };
}

/* ------------------------------------------------------------------ *
 * Сборка
 * ------------------------------------------------------------------ */

/*
 * Главный вывод из подбора параметров: рисунок «от руки» дают не смещения
 * точек, а выгиб линий.
 *
 * `maxRandomnessOffset` дёргает концы отрезков. На иконке 24×24 внутренние
 * детали — трубка телефона, ползунки, кавычки — занимают 3–4 единицы, и
 * смещение на 2 их попросту стирает: получается клякса. `bowing` выгибает
 * линию между концами, не трогая сами концы, — структура остаётся целой, а
 * прямых линий не остаётся ни одной. Именно так ведёт себя карандаш.
 *
 * Поэтому bowing высокий, offset низкий. Проверено на самых мелких иконках
 * набора при отрисовке в 20 px.
 */
const uiOptions = (key) => ({
  roughness: 0.9,
  bowing: 5,
  maxRandomnessOffset: 1.2,
  seed: seedOf(key),
  preserveVertices: false,
});

/** Декоративные крупнее и проще по форме — рука может быть свободнее. */
const decorativeOptions = (key) => ({
  roughness: 1.5,
  bowing: 5.5,
  maxRandomnessOffset: 2,
  seed: seedOf(key),
  preserveVertices: false,
});

const out = { ui: {}, decorative: {} };

for (const [key, exportName] of Object.entries(ui)) {
  const { strokes } = roughen(lucideShapes(exportName), uiOptions(key));
  out.ui[key] = { strokes };
}

for (const [key, exportName] of Object.entries(filled)) {
  const { strokes, hatches } = roughen(lucideShapes(exportName), {
    ...uiOptions(key),
    fill: '#000',
    fillStyle: 'zigzag',
    fillWeight: 0.7,
    hachureGap: 2.3,
    hachureAngle: -41,
  });
  out.ui[key] = { strokes, hatches };
}

for (const [key, shapes] of Object.entries(decorative)) {
  const { strokes } = roughen(shapes, decorativeOptions(key));
  out.decorative[key] = { strokes };
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(out, null, 2)}\n`);

const size = (fs.statSync(outFile).size / 1024).toFixed(1);
console.log(
  `${Object.keys(out.ui).length} интерфейсных + ${Object.keys(out.decorative).length} декоративных → ${outFile.replace(root + '/', '')} (${size} КБ)`,
);
