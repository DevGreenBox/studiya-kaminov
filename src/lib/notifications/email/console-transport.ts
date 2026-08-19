import type { EmailMessage, EmailTransport } from './types';

/**
 * Транспорт для разработки: письмо не уходит наружу, а печатается в терминал.
 * Используется, пока не заданы SMTP-креденшелы (см. .env.example).
 */
export class ConsoleEmailTransport implements EmailTransport {
  readonly id = 'console';

  async send(message: EmailMessage) {
    console.info(
      [
        '',
        '──────────── EMAIL (dev) ────────────',
        `Кому:  ${message.to}`,
        `Тема:  ${message.subject}`,
        '',
        message.text,
        '─────────────────────────────────────',
        '',
      ].join('\n'),
    );
    return { ok: true, info: 'Письмо выведено в консоль (EMAIL_TRANSPORT=console)' };
  }
}
