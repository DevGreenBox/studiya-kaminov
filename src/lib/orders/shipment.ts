import type { Product } from '@/types';

/**
 * Оценка веса и объёма отправления.
 *
 * Точных весов в материалах заказчика нет, поэтому вес считается по габаритам
 * и усреднённой плотности изделия из МДФ с искусственным камнем. Значение
 * используется только для предварительного расчёта доставки и всегда
 * сопровождается пометкой «предварительно».
 *
 * Когда появятся реальные веса — добавьте поле `weight` в товар (тип уже это
 * допускает) и они будут использоваться вместо оценки.
 */

/** кг на кубический метр габаритного объёма. */
const ESTIMATED_DENSITY = 210;
/** Габариты по умолчанию, если размеры позиции неизвестны, мм. */
const FALLBACK = { width: 900, height: 750, depth: 350 };

const volumeM3 = (d: { width: number; height: number; depth: number }) =>
  (d.width / 1000) * (d.height / 1000) * (d.depth / 1000);

export interface ShipmentEstimate {
  weight: number;
  volume: number;
  maxDimensions: { width: number; height: number; depth: number };
  declaredValue: number;
  /** true, если хотя бы у одной позиции габариты неизвестны. */
  hasUnknownDimensions: boolean;
}

export function estimateShipment(lines: { product: Product; quantity: number }[]): ShipmentEstimate {
  let volume = 0;
  let hasUnknownDimensions = false;
  const max = { width: 0, height: 0, depth: 0 };
  let declaredValue = 0;

  for (const { product, quantity } of lines) {
    const dims = product.dimensions ?? FALLBACK;
    if (!product.dimensions) hasUnknownDimensions = true;

    volume += volumeM3(dims) * quantity;
    declaredValue += product.price * quantity;

    max.width = Math.max(max.width, dims.width);
    max.height = Math.max(max.height, dims.height);
    max.depth = Math.max(max.depth, dims.depth);
  }

  return {
    weight: Math.max(1, Math.round(volume * ESTIMATED_DENSITY)),
    volume: Math.round(volume * 1000) / 1000,
    maxDimensions: max.width ? max : FALLBACK,
    declaredValue,
    hasUnknownDimensions,
  };
}
