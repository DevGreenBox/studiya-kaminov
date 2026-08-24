/**
 * Собирает обложки категорий и баннеры акций из уже подготовленных
 * фотографий товаров.
 *
 *   node scripts/make-covers.mjs
 *
 * Исходники берутся из public/images/products — это те же фотографии
 * заказчика, только приведённые к WebP. Для каждой категории выбран
 * фронтальный кадр, а окно кадрирования задано вручную: так камины стоят
 * в одном масштабе и по центру, а маркетплейс-надписи остаются за рамкой.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');

/**
 * focusX / focusY — центр окна кадрирования (доли от размера кадра),
 * zoom — какая часть ширины исходника попадает в обложку (1 — вся ширина).
 * Значения подобраны по кадрам: камин стоит по центру, надписи остаются за
 * рамкой, масштаб между категориями примерно одинаковый.
 */
const COVERS = {
  'kaminy-s-kamnem': { src: 'dublin-white/01.webp', focusX: 0.5, focusY: 0.6, zoom: 1 },
  klassicheskie: { src: 'versal-ivory/01.webp', focusX: 0.56, focusY: 0.56, zoom: 1 },
  sovremennye: { src: 'modern-white/01.webp', focusX: 0.45, focusY: 0.6, zoom: 1 },
  's-bokovymi-tumbami': { src: 'dublin-premium-white-grey/01.webp', focusX: 0.5, focusY: 0.58, zoom: 1 },
  uglovye: { src: 'malta-corner-votan/02.webp', focusX: 0.5, focusY: 0.48, zoom: 1 },
  'tumby-pod-tv': { src: 'chester-white/01.webp', focusX: 0.47, focusY: 0.56, zoom: 1 },
};

/**
 * Баннеры для карусели на первом экране.
 *
 * Кадр вертикальный (4:5). Там, где на исходной фотографии есть
 * маркетплейс-надписи сверху и снизу, окно кадрирования сдвинуто так, чтобы
 * они остались за рамкой.
 */
const PROMOS = {
  'sale-dublin-ivory': { src: 'dublin-ivory/01.webp', focusX: 0.5, focusY: 0.5, zoom: 1 },
  'new-dublin-premium': { src: 'dublin-premium-white-grey/01.webp', focusX: 0.5, focusY: 0.5, zoom: 1 },
  'sale-chester': { src: 'chester-white/02.webp', focusX: 0.5, focusY: 0.4, zoom: 0.92 },
  'new-modern': { src: 'modern-white/01.webp', focusX: 0.5, focusY: 0.5, zoom: 1 },
  'news-promo': { src: 'malta-white/01.webp', focusX: 0.5, focusY: 0.5, zoom: 1 },
};

/**
 * Кадры для блока о производстве.
 *
 * Инфографика с подписями там смотрится дёшево, поэтому берём чистые
 * детальные снимки: горящие дрова, фактура камня, край топки.
 */
const PRODUCTION = {
  'hearth-wide': { src: 'malta-wenge/01.webp', focusX: 0.5, focusY: 0.5, zoom: 1, out: { width: 1200, height: 750 } },
  'stone-detail': { src: 'dublin-ivory/02.webp', focusX: 0.5, focusY: 0.45, zoom: 1, out: { width: 700, height: 700 } },
  'firebox-detail': { src: 'dublin-ivory/03.webp', focusX: 0.5, focusY: 0.5, zoom: 1, out: { width: 700, height: 700 } },
  'hearth-square': { src: 'malta-wenge/01.webp', focusX: 0.5, focusY: 0.5, zoom: 1, out: { width: 700, height: 700 } },
};

const OUT = { width: 900, height: 675 }; // 4:3 — плитки категорий
const PROMO_OUT = { width: 760, height: 950 }; // 4:5 — баннеры карусели

/** Вырезает окно заданных пропорций вокруг точки фокуса и сохраняет в WebP. */
async function crop(file, dest, out, cfg) {
  const ratio = out.height / out.width;
  const meta = await sharp(file).metadata();

  // Окно не должно вылезать за кадр ни по одной стороне.
  let cropW = Math.round(meta.width * cfg.zoom);
  let cropH = Math.round(cropW * ratio);
  if (cropH > meta.height) {
    cropH = meta.height;
    cropW = Math.round(cropH / ratio);
  }

  const left = Math.max(0, Math.min(meta.width - cropW, Math.round(meta.width * cfg.focusX - cropW / 2)));
  const top = Math.max(0, Math.min(meta.height - cropH, Math.round(meta.height * cfg.focusY - cropH / 2)));

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(file)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(out.width, out.height, { fit: 'cover' })
    .webp({ quality: 84 })
    .toFile(dest);
}

let written = 0;
for (const [slug, cfg] of Object.entries(COVERS)) {
  const file = path.join(root, 'public/images/products', cfg.src);
  if (!fs.existsSync(file)) {
    console.warn(`  ! нет исходника: ${cfg.src}`);
    continue;
  }

  await crop(file, path.join(root, 'public/images/categories', `${slug}.webp`), OUT, cfg);
  written++;
  console.log(`${slug} ← ${cfg.src}`);
}

for (const [id, cfg] of Object.entries(PROMOS)) {
  const file = path.join(root, 'public/images/products', cfg.src);
  if (!fs.existsSync(file)) {
    console.warn(`  ! нет исходника: ${cfg.src}`);
    continue;
  }
  await crop(file, path.join(root, 'public/images/promos', `${id}.webp`), PROMO_OUT, cfg);
  written++;
  console.log(`баннер ${id} ← ${cfg.src}`);
}

for (const [id, cfg] of Object.entries(PRODUCTION)) {
  const file = path.join(root, 'public/images/products', cfg.src);
  if (!fs.existsSync(file)) {
    console.warn(`  ! нет исходника: ${cfg.src}`);
    continue;
  }
  await crop(file, path.join(root, 'public/images/production', `${id}.webp`), cfg.out, cfg);
  written++;
  console.log(`производство ${id} ← ${cfg.src}`);
}

console.log(`\nГотово. Изображений: ${written}`);
