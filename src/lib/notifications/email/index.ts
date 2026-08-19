import type { EmailTransport } from './types';
import { ConsoleEmailTransport } from './console-transport';
import { SmtpEmailTransport } from './smtp-transport';

export type { EmailMessage, EmailTransport } from './types';

export function getEmailTransport(): EmailTransport {
  const kind = process.env.EMAIL_TRANSPORT ?? 'console';

  if (kind === 'smtp') {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.EMAIL_FROM;

    if (host && user && password && from) {
      return new SmtpEmailTransport({
        host,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true',
        user,
        password,
        from,
      });
    }

    console.warn('[email] EMAIL_TRANSPORT=smtp, но не заданы SMTP_*. Письма пишутся в консоль.');
  }

  return new ConsoleEmailTransport();
}

/** Адрес магазина, куда приходят заказы и заявки. */
export const shopEmail = () => process.env.EMAIL_SHOP ?? 'shop@example.local';
