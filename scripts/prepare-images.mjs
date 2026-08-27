/**
 * Готовит изображения сайта из исходных материалов заказчика.
 *
 * Источник: архив «Для сайта.rar» с Яндекс.Диска, распакованный в папку,
 * путь к которой передаётся первым аргументом (внутри должна лежать папка «Для сайта»).
 *
 *   node scripts/prepare-images.mjs /path/to/unpacked
 *
 * Скрипт ничего не выдумывает: он берёт только те файлы, которые перечислены
 * в scripts/image-manifest.json, и раскладывает их в public/images.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'scripts/image-manifest.json'), 'utf8'),
);

const srcRoot = path.join(process.argv[2] ?? '', 'Для сайта');
if (!fs.existsSync(srcRoot)) {
  console.error(`Не найдена папка с материалами: ${srcRoot}`);
  console.error('Запуск: node scripts/prepare-images.mjs <путь к распакованному архиву>');
  process.exit(1);
}

const out = (...p) => path.join(root, 'public/images', ...p);

/**
 * Файлы, присланные заказчиком отдельно от архива.
 *
 * `incoming/products/<slug>/<NN>.<ext>` подменяет кадр с этим номером из
 * манифеста. Нужно, чтобы улучшенные фотографии не затирались обратно
 * архивными при следующей пересборке: архив остаётся источником по умолчанию,
 * а присланное заказчиком имеет приоритет.
 */
const incoming = path.join(root, 'incoming/products');
const EXT = ['.jpg', '.jpeg', '.png', '.webp'];

function override(slug, index) {
  const dir = path.join(incoming, slug);
  if (!fs.existsSync(dir)) return null;
  const stem = String(index + 1).padStart(2, '0');
  for (const ext of EXT) {
    const file = path.join(dir, stem + ext);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

let overridden = 0;
// Потолок, а не жёсткий размер: часть исходников крупнее (до 2030×2707) и
// теперь отдаёт больше деталей, мелкие остаются как есть.
const PRODUCT = { width: 1400, height: 1867 }; // 3:4 — все исходники вертикальные
const CATEGORY = { width: 900, height: 675 }; // 4:3
const HERO = { width: 1200, height: 1500 };

let written = 0;

/**
 * `withoutEnlargement` — главное здесь.
 *
 * Материалы заказчика разного размера: большинство 1024×1365, но часть
 * заметно меньше, вплоть до 550×733. Раньше все они приводились к общей цели
 * и мелкие растягивались почти вдвое — отсюда мыло на карточках товара.
 * Теперь цель работает как потолок: снимок уменьшается, но не увеличивается.
 */
async function emit(srcFile, dest, size, { fit = 'cover', quality = 88 } = {}) {
  if (!fs.existsSync(srcFile)) {
    console.warn(`  ! пропущен (нет файла): ${srcFile}`);
    return false;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(srcFile)
    .rotate()
    .resize(size.width, size.height, {
      fit,
      position: 'centre',
      background: '#f6f2ec',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(dest);
  written++;
  return true;
}

const index = { products: {}, categories: {}, shared: {}, hero: null };

for (const [slug, cfg] of Object.entries(manifest.products)) {
  const dir = path.join(srcRoot, cfg.src);
  const list = [];
  for (let i = 0; i < cfg.files.length; i++) {
    const rel = `products/${slug}/${String(i + 1).padStart(2, '0')}.webp`;
    const custom = override(slug, i);
    if (custom) overridden++;
    const src = custom ?? path.join(dir, cfg.files[i]);
    if (await emit(src, out(rel), PRODUCT)) list.push(`/images/${rel}`);
  }
  index.products[slug] = list;
  console.log(`${slug}: ${list.length} фото`);
}

// Обложки категорий собираются отдельным скриптом из уже готовых фотографий
// товаров — там окно кадрирования подобрано вручную, чтобы камины стояли по
// центру и в одном масштабе: node scripts/make-covers.mjs
for (const slug of Object.keys(manifest.categories)) {
  index.categories[slug] = `/images/categories/${slug}.webp`;
}

for (const [name, [dir, file]] of Object.entries(manifest.shared)) {
  const rel = `content/${name}.webp`;
  if (await emit(path.join(srcRoot, dir, file), out(rel), PRODUCT, { fit: 'inside' })) {
    index.shared[name] = `/images/${rel}`;
  }
}

const [heroDir, heroFile] = manifest.hero;
if (
  await emit(path.join(srcRoot, heroDir, heroFile), out('hero/hero.webp'), HERO, { quality: 86 })
) {
  index.hero = '/images/hero/hero.webp';
}

fs.writeFileSync(
  path.join(root, 'src/data/image-index.json'),
  JSON.stringify(index, null, 2) + '\n',
);
console.log(`\nГотово. Записано файлов: ${written}. Индекс: src/data/image-index.json`);
if (overridden) console.log(`Из них взято из incoming/products: ${overridden}`);
console.log('Дальше: node scripts/make-covers.mjs — обложки категорий.');
