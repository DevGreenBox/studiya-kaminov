import type { DeliveryProvider, DeliveryQuote, DeliveryRequest } from '@/types';
import { deliveryConfig } from '@/config/site';

/**
 * Демонстрационный расчёт доставки.
 *
 * Реальных тарифов и ключей «Деловых Линий» в проекте нет, поэтому здесь
 * прозрачная формула на основе веса, объёма и расстояния «по справочнику
 * зон». Результат всегда помечен `isEstimate: true` — интерфейс показывает,
 * что это предварительная оценка, а не тариф перевозчика.
 */

/** Условные зоны. Заменяются реальным справочником перевозчика. */
const ZONES: { match: RegExp; factor: number; days: [number, number] }[] = [
  { match: /москв|подмосков|московск/i, factor: 1, days: [1, 2] },
  { match: /санкт|петербург|спб|ленинградск/i, factor: 1.35, days: [2, 3] },
  { match: /казан|нижн|воронеж|ярослав|тул|рязан|владимир|калуг|тверь|смоленск/i, factor: 1.5, days: [2, 4] },
  { match: /екатеринбург|перм|уф|челябинск|самар|саратов|волгоград|ростов|краснодар/i, factor: 1.9, days: [3, 6] },
  { match: /новосибирск|омск|краснояр|барнаул|кемеров|томск|тюмен/i, factor: 2.4, days: [5, 9] },
  { match: /иркутск|чит|улан|якутск|хабаровск|владивосток|магадан|камчат|сахалин/i, factor: 3.2, days: [8, 14] },
];

const BASE_PRICE = 900;
const PER_KG = 28;
const PER_M3 = 2600;
const INSURANCE_RATE = 0.005;

export class MockDeliveryProvider implements DeliveryProvider {
  readonly id = 'mock';

  async calculate(input: DeliveryRequest): Promise<DeliveryQuote> {
    const city = input.destinationCity.trim();
    if (city.length < 2) {
      throw new Error('Укажите город доставки');
    }

    const zone = ZONES.find((z) => z.match.test(city));
    const factor = zone?.factor ?? 2.1;
    const [minDays, maxDays] = zone?.days ?? [4, 8];

    const weightPart = Math.max(input.weight, 1) * PER_KG;
    const volumePart = Math.max(input.volume, 0.05) * PER_M3;
    const insurance = input.declaredValue * INSURANCE_RATE;

    // Негабарит по длинной стороне — надбавка, как у реальных перевозчиков.
    const longestSide = Math.max(
      input.maxDimensions.width,
      input.maxDimensions.height,
      input.maxDimensions.depth,
    );
    const oversize = longestSide > 1500 ? 1.2 : 1;

    const price = Math.round(
      ((BASE_PRICE + weightPart + volumePart) * factor * oversize + insurance) / 50,
    ) * 50;

    return {
      carrier: deliveryConfig.carrier,
      price,
      minDays,
      maxDays,
      isEstimate: true,
      note: zone
        ? undefined
        : 'Город не найден в справочнике зон — показана средняя оценка. Точную стоимость подтвердит менеджер.',
    };
  }
}
