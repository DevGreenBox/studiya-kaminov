import { NextResponse } from 'next/server';
import { getEmailTransport, shopEmail } from '@/lib/notifications/email';
import { sellerRequestEmail } from '@/lib/orders/emails';
import { isValidEmail } from '@/lib/format';

interface Body {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
  productName?: unknown;
}

const str = (value: unknown, max = 2000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const name = str(body.name, 120);
  const phone = str(body.phone, 40);
  const email = str(body.email, 160);
  const message = str(body.message);
  const productName = str(body.productName, 200);

  if (name.length < 2) {
    return NextResponse.json({ error: 'Укажите имя' }, { status: 400 });
  }
  if (phone.replace(/\D/g, '').length !== 11) {
    return NextResponse.json({ error: 'Укажите телефон полностью' }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: 'Проверьте адрес почты' }, { status: 400 });
  }

  try {
    const transport = getEmailTransport();
    await transport.send(
      sellerRequestEmail({ name, phone, email, message, productName }, shopEmail()),
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] не удалось отправить заявку:', error);
    return NextResponse.json(
      { error: 'Не удалось отправить заявку. Позвоните нам или попробуйте позже.' },
      { status: 502 },
    );
  }
}
