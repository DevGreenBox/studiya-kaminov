import { NextResponse } from 'next/server';
import { resolveCartLines } from '@/lib/cart-lines';
import { createOrderNumber, getOrderStore } from '@/lib/orders/store';
import { customerOrderEmail, shopOrderEmail } from '@/lib/orders/emails';
import { getEmailTransport, shopEmail } from '@/lib/notifications/email';
import { promoDiscount } from '@/lib/promo';
import { applyPromoCode } from '@/lib/promo';
import { isValidEmail } from '@/lib/format';
import { deliveryConfig } from '@/config/site';
import type { CartItem, Order, OrderLine } from '@/types';

const str = (value: unknown, max = 500) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

interface Body {
  items?: unknown;
  customer?: { name?: unknown; phone?: unknown; email?: unknown };
  recipient?: { name?: unknown; phone?: unknown } | null;
  delivery?: {
    method?: unknown;
    city?: unknown;
    address?: unknown;
    price?: unknown;
    minDays?: unknown;
    maxDays?: unknown;
    isEstimate?: unknown;
  };
  comment?: unknown;
  promoCode?: unknown;
  consent?: unknown;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const name = str(body.customer?.name, 120);
  const phone = str(body.customer?.phone, 40);
  const email = str(body.customer?.email, 160);

  if (name.length < 2) return NextResponse.json({ error: 'Укажите имя' }, { status: 400 });
  if (phone.replace(/\D/g, '').length !== 11)
    return NextResponse.json({ error: 'Укажите телефон полностью' }, { status: 400 });
  if (!isValidEmail(email))
    return NextResponse.json({ error: 'Проверьте адрес почты' }, { status: 400 });
  if (body.consent !== true)
    return NextResponse.json({ error: 'Нужно согласие на обработку данных' }, { status: 400 });

  const rawItems = Array.isArray(body.items) ? (body.items as CartItem[]) : [];
  const lines = resolveCartLines(
    rawItems
      .filter((item) => typeof item?.productId === 'string')
      .map((item) => ({
        productId: item.productId,
        quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
      })),
  );
  if (lines.length === 0) return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 });

  const method = body.delivery?.method === 'pickup' ? 'pickup' : 'carrier';
  const city = str(body.delivery?.city, 120);
  const address = str(body.delivery?.address, 300);

  if (method === 'carrier') {
    if (city.length < 2)
      return NextResponse.json({ error: 'Укажите город доставки' }, { status: 400 });
    if (address.length < 4)
      return NextResponse.json({ error: 'Укажите адрес доставки' }, { status: 400 });
  }

  // Цены и скидка считаются на сервере — клиентским суммам не доверяем.
  const orderLines: OrderLine[] = lines.map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    sku: product.sku,
    color: product.color,
    price: product.price,
    quantity,
    total: product.price * quantity,
  }));

  const itemsTotal = orderLines.reduce((sum, line) => sum + line.total, 0);

  const promoInput = str(body.promoCode, 40);
  const promoResult = promoInput ? applyPromoCode(promoInput) : null;
  const promo = promoResult?.status === 'applied' ? promoResult.promo : undefined;
  const discount = promoDiscount(itemsTotal, promo);

  const deliveryPrice =
    method === 'pickup' ? 0 : Math.max(0, Math.round(Number(body.delivery?.price) || 0));

  const order: Order = {
    number: createOrderNumber(),
    createdAt: new Date().toISOString(),
    customer: { name, phone, email },
    recipient:
      body.recipient && str(body.recipient.name)
        ? { name: str(body.recipient.name, 120), phone: str(body.recipient.phone, 40) }
        : undefined,
    delivery: {
      method,
      carrier: method === 'carrier' ? deliveryConfig.carrier : undefined,
      city: method === 'carrier' ? city : undefined,
      address: method === 'carrier' ? address : undefined,
      price: deliveryPrice,
      minDays: Number(body.delivery?.minDays) || undefined,
      maxDays: Number(body.delivery?.maxDays) || undefined,
      isEstimate: body.delivery?.isEstimate === true,
    },
    comment: str(body.comment, 1500) || undefined,
    lines: orderLines,
    itemsTotal,
    promo,
    discount,
    total: itemsTotal - discount + deliveryPrice,
  };

  await getOrderStore().save(order);

  // Уведомления не должны ронять оформление заказа: заказ уже сохранён.
  try {
    const transport = getEmailTransport();
    await Promise.all([
      transport.send(shopOrderEmail(order, shopEmail())),
      transport.send(customerOrderEmail(order)),
    ]);
  } catch (error) {
    console.error('[orders] заказ создан, но письма не отправлены:', error);
  }

  return NextResponse.json({ order });
}
