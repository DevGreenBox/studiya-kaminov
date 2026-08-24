import type { Order } from '@/types';
import { site, contacts } from '@/config/site';
import { formatPrice, formatDateTime } from '@/lib/format';
import type { EmailMessage } from '@/lib/notifications/email';

const linesTable = (order: Order) =>
  order.lines
    .map(
      (l) =>
        `  • ${l.name}${l.sku ? ` (арт. ${l.sku})` : ''} — ${l.quantity} шт. × ${formatPrice(l.price)} = ${formatPrice(l.total)}`,
    )
    .join('\n');

/** Строка стоимости доставки: 0 ₽ у перевозчика означает «ещё не рассчитана». */
const deliveryLine = (order: Order) => {
  if (order.delivery.method === 'pickup') return 'самовывоз';
  if (order.delivery.price > 0) return formatPrice(order.delivery.price);
  return 'рассчитает менеджер';
};

const totals = (order: Order) =>
  [
    `Товары: ${formatPrice(order.itemsTotal)}`,
    order.discount > 0
      ? `Скидка${order.promo ? ` (${order.promo.code})` : ''}: −${formatPrice(order.discount)}`
      : null,
    `Доставка: ${deliveryLine(order)}`,
    `Итого: ${formatPrice(order.total)}${order.delivery.method === 'carrier' && order.delivery.price === 0 ? ' (без доставки)' : ''}`,
  ]
    .filter(Boolean)
    .join('\n');

const htmlWrap = (title: string, body: string) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;background:#fbf8f4;font-family:Arial,Helvetica,sans-serif;color:#1c1917">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="background:#fff;border:1px solid #e9e2d8;border-radius:14px;padding:24px">
      <h1 style="margin:0 0 16px;font-size:20px">${title}</h1>
      ${body}
    </div>
    <p style="color:#8a827a;font-size:12px;margin:16px 0 0">${site.name} — ${site.tagline}</p>
  </div>
</body></html>`;

const linesHtml = (order: Order) => `
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tbody>
      ${order.lines
        .map(
          (l) => `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #f3ede4">${l.name}${l.sku ? `<br><span style="color:#8a827a;font-size:12px">арт. ${l.sku}</span>` : ''}</td>
            <td style="padding:8px 0;border-bottom:1px solid #f3ede4;text-align:right;white-space:nowrap">${l.quantity} × ${formatPrice(l.price)}</td>
          </tr>`,
        )
        .join('')}
    </tbody>
  </table>
  <p style="font-size:14px;line-height:1.7;margin:16px 0 0">
    Товары: ${formatPrice(order.itemsTotal)}<br>
    ${order.discount > 0 ? `Скидка${order.promo ? ` (${order.promo.code})` : ''}: −${formatPrice(order.discount)}<br>` : ''}
    Доставка: ${deliveryLine(order)}<br>
    <strong>Итого: ${formatPrice(order.total)}</strong>
  </p>`;

/** Письмо покупателю — подтверждение заказа. */
export function customerOrderEmail(order: Order): EmailMessage {
  const subject = `Заказ ${order.number} принят — ${site.name}`;
  const text = `Здравствуйте, ${order.customer.name}!

Мы приняли ваш заказ ${order.number} от ${formatDateTime(order.createdAt)}.

Состав заказа:
${linesTable(order)}

${totals(order)}

Доставка: ${order.delivery.method === 'pickup' ? 'самовывоз' : `${order.delivery.carrier ?? ''}, ${order.delivery.city ?? ''}`}

Менеджер свяжется с вами по телефону ${order.customer.phone}, чтобы подтвердить состав заказа и сроки.

${site.name}
${contacts.phone}`;

  return {
    to: order.customer.email,
    subject,
    text,
    html: htmlWrap(
      `Заказ ${order.number} принят`,
      `<p style="font-size:14px;line-height:1.7">Здравствуйте, ${order.customer.name}! Мы приняли ваш заказ от ${formatDateTime(order.createdAt)}. Менеджер свяжется с вами по телефону ${order.customer.phone}.</p>${linesHtml(order)}`,
    ),
  };
}

/** Письмо магазину — новый заказ. */
export function shopOrderEmail(order: Order, to: string): EmailMessage {
  const subject = `Новый заказ ${order.number} на ${formatPrice(order.total)}`;
  const text = `Новый заказ ${order.number} от ${formatDateTime(order.createdAt)}

Покупатель: ${order.customer.name}
Телефон: ${order.customer.phone}
Email: ${order.customer.email}
${order.recipient ? `Получатель: ${order.recipient.name}, ${order.recipient.phone}\n` : ''}
Доставка: ${order.delivery.method === 'pickup' ? 'самовывоз' : `${order.delivery.carrier}, ${order.delivery.city}, ${order.delivery.address ?? ''}`}
${order.delivery.isEstimate ? '(стоимость доставки — предварительная оценка, требует подтверждения перевозчиком)\n' : ''}
Состав:
${linesTable(order)}

${totals(order)}
${order.comment ? `\nКомментарий: ${order.comment}` : ''}`;

  return {
    to,
    subject,
    text,
    html: htmlWrap(
      `Новый заказ ${order.number}`,
      `<p style="font-size:14px;line-height:1.7">${order.customer.name}<br>${order.customer.phone}<br>${order.customer.email}</p>${linesHtml(order)}${order.comment ? `<p style="font-size:14px">Комментарий: ${order.comment}</p>` : ''}`,
    ),
  };
}

/** Письмо магазину — заявка «Связаться с продавцом». */
export function sellerRequestEmail(
  payload: { name: string; phone: string; email?: string; message?: string; productName?: string },
  to: string,
): EmailMessage {
  const subject = payload.productName
    ? `Вопрос по товару: ${payload.productName}`
    : 'Новая заявка с сайта';

  const text = `${subject}

Имя: ${payload.name}
Телефон: ${payload.phone}
${payload.email ? `Email: ${payload.email}\n` : ''}${payload.productName ? `Товар: ${payload.productName}\n` : ''}
Сообщение:
${payload.message || '—'}`;

  return {
    to,
    subject,
    text,
    html: htmlWrap(
      subject,
      `<p style="font-size:14px;line-height:1.7">${payload.name}<br>${payload.phone}${payload.email ? `<br>${payload.email}` : ''}${payload.productName ? `<br>Товар: ${payload.productName}` : ''}</p><p style="font-size:14px;line-height:1.7">${payload.message || '—'}</p>`,
    ),
  };
}
