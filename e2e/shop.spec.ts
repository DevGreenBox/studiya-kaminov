import { test, expect } from '@playwright/test';

/**
 * Smoke-тесты критических сценариев из ТЗ.
 * Проверяют, что интерфейс действительно работает, а не только отрисован.
 */

/**
 * Cookie-баннер закреплён внизу экрана и на узких экранах перекрывает нижнюю
 * часть контента. Гасим его до первой навигации, чтобы клики в тестах били
 * туда, куда задумано, а не в баннер.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ef-cookie-accepted', '1');
    } catch {
      // приватный режим — баннер останется, тесты это переживут
    }
  });
  await page.goto('/');
});

test('главная открывается и ведёт в каталог', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Электрокамины');
  await page.getByRole('link', { name: 'Смотреть каталог' }).first().click();
  await expect(page).toHaveURL(/\/catalog$/);
  await expect(page.getByText(/Найдено: \d+ товар/)).toBeVisible();
});

test('фильтр по категории меняет выдачу и отражается в URL', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('button', { name: 'Угловые камины' }).click();
  await expect(page).toHaveURL(/category=uglovye/);
  await expect(page.getByText('Найдено: 1 товар')).toBeVisible();
});

test('сортировка по цене работает', async ({ page }) => {
  await page.goto('/catalog?sort=price-asc');
  const prices = await page.locator('main article').evaluateAll((cards) =>
    cards
      .map((card) => card.textContent?.match(/([\d\s  ]+)\s*₽/)?.[1])
      .filter((value): value is string => Boolean(value))
      .map((value) => Number(value.replace(/\D/g, ''))),
  );
  expect(prices.length).toBeGreaterThan(1);
  expect([...prices].sort((a, b) => a - b)).toEqual(prices);
});

test('пустая выдача показывает понятное состояние и сброс фильтров', async ({ page }) => {
  await page.goto('/catalog?priceMin=999999');
  await expect(page.getByText('По выбранным параметрам ничего не найдено')).toBeVisible();
  await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
  await expect(page.getByText(/Найдено: \d+ товар/)).toBeVisible();
});

test('поиск находит товар и открывает его', async ({ page }) => {
  await page.goto('/search?q=честер');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('честер');
  await page
    .getByRole('link', { name: /Честер/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/catalog\/chester-white/);
});

test('избранное добавляется и переживает перезагрузку', async ({ page }) => {
  await page.goto('/catalog/dublin-white');
  await page.getByRole('button', { name: 'Добавить в избранное' }).click();
  await expect(page.getByRole('button', { name: 'Убрать из избранного' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: 'Убрать из избранного' })).toBeVisible();

  await page.goto('/favorites');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Избранное');
  await expect(page.getByRole('link', { name: /Дублин, белый/ }).first()).toBeVisible();
});

test('карточка каталога кликабельна целиком', async ({ page }) => {
  await page.goto('/catalog');
  const card = page.locator('main article').first();
  const href = await card.getByRole('link').first().getAttribute('href');

  // Клик по области с характеристиками — не по заголовку и не по кнопке
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  if (!box) throw new Error('карточка не отрисована');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.62);

  await expect(page).toHaveURL(new RegExp(`${href}$`));
});

test('кнопки внутри карточки не открывают товар', async ({ page }) => {
  await page.goto('/catalog');
  const card = page.locator('main article').first();

  await card.getByRole('button', { name: /^Добавить в корзину/ }).click();
  await expect(page).toHaveURL(/\/catalog$/);
  await expect(page.getByRole('link', { name: /^Корзина, 1$/ })).toBeVisible();

  await card.getByRole('button', { name: /избранное/ }).click();
  await expect(page).toHaveURL(/\/catalog$/);
  await expect(page.getByRole('link', { name: /^Избранное, 1$/ })).toBeVisible();
});

test('главное фото товара помещается на экран', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/catalog/verona-white');

  const box = await page.locator('main img').first().locator('..').boundingBox();
  if (!box) throw new Error('галерея не отрисована');

  // Кадр 3:4 не растянут и целиком помещается в окно
  expect(box.width / box.height).toBeCloseTo(0.75, 2);
  expect(box.y + box.height).toBeLessThanOrEqual(800);
});

test('фото товара открывается на весь экран', async ({ page }) => {
  await page.goto('/catalog/verona-white');

  const gallery = await page.locator('main img').first().boundingBox();
  await page.getByRole('button', { name: /Открыть фото/ }).click();

  const viewer = page.getByRole('dialog', { name: /просмотр фотографий/ });
  await expect(viewer).toBeVisible();

  // Просмотр должен давать заметный выигрыш по высоте, иначе он бессмыслен
  const shown = await viewer.locator('img').first().boundingBox();
  expect(shown!.height).toBeGreaterThan(gallery!.height * 1.2);

  // Листание и счётчик
  await expect(viewer.getByText(/Фото 1 из/)).toBeVisible();
  await page.getByRole('button', { name: 'Следующее фото' }).click();
  await expect(viewer.getByText(/Фото 2 из/)).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
});

test('корзина: добавление, количество, промокод, удаление', async ({ page }) => {
  await page.goto('/catalog/malta-white');
  await page.locator('#purchase-block').getByRole('button', { name: 'В корзину' }).click();
  await expect(page.getByRole('link', { name: /^Корзина, 1$/ })).toBeVisible();

  await page.goto('/cart');
  await page.getByRole('button', { name: 'Увеличить количество' }).click();
  await expect(page.locator('aside')).toContainText('69 800 ₽');

  await page.getByPlaceholder('Промокод').fill('FIRE10');
  await page.getByRole('button', { name: 'Применить' }).click();
  await expect(page.locator('aside')).toContainText('−6 980 ₽');
  await expect(page.locator('aside')).toContainText('62 820 ₽');

  await page
    .getByPlaceholder('Промокод')
    .isVisible()
    .catch(() => false);
  await page.getByRole('button', { name: /Удалить .* из корзины/ }).click();
  await expect(page.getByText('Корзина пока пуста')).toBeVisible();
});

test('неверный промокод показывает ошибку', async ({ page }) => {
  await page.goto('/catalog/malta-white');
  await page.locator('#purchase-block').getByRole('button', { name: 'В корзину' }).click();
  await page.goto('/cart');
  await page.getByPlaceholder('Промокод').fill('WRONG');
  await page.getByRole('button', { name: 'Применить' }).click();
  await expect(page.getByText('Промокод не найден')).toBeVisible();
});

test('оформление заказа: расчёт доставки, валидация и накладная', async ({ page }) => {
  await page.goto('/catalog/malta-white');
  await page.locator('#purchase-block').getByRole('button', { name: 'В корзину' }).click();
  await page.goto('/checkout');

  await page.getByRole('textbox', { name: 'Имя', exact: true }).fill('Тест Тестов');
  await page.getByRole('textbox', { name: 'Телефон', exact: true }).fill('9031112233');
  await expect(page.getByRole('textbox', { name: 'Телефон', exact: true })).toHaveValue(
    '+7 (903) 111-22-33',
  );
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
  await page.getByRole('textbox', { name: 'Город' }).fill('Екатеринбург');
  await page.getByRole('textbox', { name: 'Адрес или терминал' }).fill('ул. Ленина, 1');

  await page.getByRole('button', { name: 'Рассчитать' }).click();
  // Считаются обе транспортные компании сразу
  await expect(
    page
      .getByRole('radiogroup', { name: 'Транспортная компания' })
      .getByRole('radio', { name: /СДЭК/ }),
  ).toBeChecked();
  await expect(page.getByText(/^Срок: /).first()).toBeVisible();

  // без согласия заказ не оформляется
  await page.getByRole('button', { name: 'Оформить заказ' }).click();
  await expect(page.getByText('Нужно согласие на обработку данных')).toBeVisible();

  await page.getByRole('checkbox').last().check();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page).toHaveURL(/\/order\/success/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Заказ оформлен');
  await expect(page.getByText(/ЭК-\d{6}-\d{4}/).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Накладная к заказу' })).toBeVisible();
  await expect(page.locator('table tbody tr')).toHaveCount(1);
});

test('можно выбрать вторую транспортную компанию', async ({ page }) => {
  await page.goto('/catalog/chester-white');
  await page.locator('#purchase-block').getByRole('button', { name: 'В корзину' }).click();
  await page.goto('/checkout');

  await page.getByRole('textbox', { name: 'Город' }).fill('Новосибирск');
  await page.getByRole('button', { name: 'Рассчитать' }).click();

  const group = page.getByRole('radiogroup', { name: 'Транспортная компания' });
  const cdek = group.getByRole('radio', { name: /СДЭК/ });
  const dellin = group.getByRole('radio', { name: /Деловые Линии/ });
  await expect(cdek).toBeChecked();

  // Итог пересчитывается под выбранного перевозчика
  const before = await page.locator('aside').innerText();
  await dellin.check();
  await expect(dellin).toBeChecked();
  await expect(page.locator('aside')).not.toHaveText(before);
  await expect(page.locator('aside')).toContainText('Доставка');
});

test('форма «Связаться с продавцом» отправляется', async ({ page }) => {
  await page.goto('/catalog/chester-white');
  await page.getByRole('button', { name: 'Связаться с продавцом' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Честер');

  await dialog.getByRole('textbox', { name: 'Имя', exact: true }).fill('Мария');
  await dialog.getByRole('textbox', { name: 'Телефон', exact: true }).fill('9997654321');
  await dialog.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(dialog.getByText('Нужно согласие на обработку данных')).toBeVisible();

  await dialog.getByRole('checkbox').check();
  await dialog.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.getByText('Спасибо, заявка отправлена')).toBeVisible();
});

test('панель фильтров прокручивается отдельно от каталога', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, 'на мобильном фильтры открываются в шторке');

  await page.goto('/catalog');
  const panel = page.locator('aside > div').first();

  // Пока страница не прокручена, липкая панель ещё не прижата к верху и её низ
  // лежит ниже экрана — воспроизводим то состояние, в котором ей пользуются
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(200);

  const state = await panel.evaluate((el) => ({
    client: el.clientHeight,
    scroll: el.scrollHeight,
    overflow: getComputedStyle(el).overflowY,
  }));

  // Панель выше экрана — значит обязана иметь собственную прокрутку,
  // иначе нижние фильтры недостижимы, пока каталог не домотан до конца
  expect(state.scroll).toBeGreaterThan(state.client);
  expect(state.overflow).toBe('auto');
  expect(state.client).toBeLessThanOrEqual(page.viewportSize()!.height);

  // Последняя группа фильтров достижима прокруткой самой панели
  await panel.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await expect(panel.getByText('Дополнительно').first()).toBeInViewport();
});

test('карусель видов каминов листается и ведёт в каталог', async ({ page }) => {
  await page.goto('/about');

  const track = page.locator('section[aria-label="Виды каминов"] ul');
  const before = await track.evaluate((el) => el.scrollLeft);

  if ((page.viewportSize()?.width ?? 0) < 640) {
    // На узких экранах стрелок нет: листают пальцем, а для клика есть точки
    await page
      .getByRole('button', { name: /^Показать/ })
      .nth(2)
      .click();
  } else {
    const back = page.getByRole('button', { name: 'Предыдущие камины' });
    const forward = page.getByRole('button', { name: 'Следующие камины' });

    // Стрелки не зациклены: на краях они гаснут
    await expect(back).toBeDisabled();
    await expect(forward).toBeEnabled();

    await forward.click();
    await expect(back).toBeEnabled();
  }

  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);

  // Карточка ведёт в отфильтрованный каталог
  await page
    .getByRole('link', { name: /Угловые камины/ })
    .first()
    .click();
  await expect(page).toHaveURL(/category=uglovye/);
});

test('404 показывает страницу с выходами', async ({ page }) => {
  const response = await page.goto('/nonexistent');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'В каталог' })).toBeVisible();
});

test('ни одна страница не даёт горизонтальный скролл', async ({ page }) => {
  for (const path of [
    '/',
    '/catalog',
    '/catalog/dublin-white',
    '/cart',
    '/checkout',
    '/about',
    '/delivery',
    '/contacts',
  ]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `горизонтальный скролл на ${path}`).toBe(false);
  }
});
