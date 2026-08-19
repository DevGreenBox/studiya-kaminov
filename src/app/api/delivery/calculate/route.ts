import { NextResponse } from 'next/server';
import { getDeliveryProvider } from '@/lib/delivery';
import { estimateShipment } from '@/lib/orders/shipment';
import { resolveCartLines } from '@/lib/cart-lines';
import { deliveryConfig } from '@/config/site';
import type { CartItem } from '@/types';

interface Body {
  city?: unknown;
  items?: unknown;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const city = typeof body.city === 'string' ? body.city.trim() : '';
  if (city.length < 2) {
    return NextResponse.json({ error: 'Укажите город доставки' }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? (body.items as CartItem[]) : [];
  const lines = resolveCartLines(
    rawItems
      .filter((item) => typeof item?.productId === 'string')
      .map((item) => ({
        productId: item.productId,
        quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
      })),
  );

  if (lines.length === 0) {
    return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 });
  }

  const shipment = estimateShipment(lines);

  try {
    const quote = await getDeliveryProvider().calculate({
      originCity: deliveryConfig.originCity,
      destinationCity: city,
      weight: shipment.weight,
      volume: shipment.volume,
      maxDimensions: shipment.maxDimensions,
      declaredValue: shipment.declaredValue,
    });

    return NextResponse.json({
      quote,
      shipment: {
        weight: shipment.weight,
        volume: shipment.volume,
        hasUnknownDimensions: shipment.hasUnknownDimensions,
      },
    });
  } catch (error) {
    console.error('[delivery] расчёт не удался:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Не удалось рассчитать доставку. Попробуйте ещё раз или укажите город точнее.',
      },
      { status: 502 },
    );
  }
}
