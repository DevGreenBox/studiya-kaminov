import type { EmailMessage, EmailTransport } from './types';

/**
 * Заготовка боевого SMTP-транспорта.
 *
 * Реальная отправка требует почтового клиента (например, nodemailer) и
 * креденшелов из .env.local. Зависимость намеренно не добавлена в проект,
 * чтобы не тянуть её без необходимости: подключается одной строкой, когда
 * заказчик предоставит доступы.
 *
 *   npm i nodemailer
 *   const transporter = nodemailer.createTransport({ host, port, secure, auth });
 *   await transporter.sendMail({ from, to, subject, text, html });
 */
export class SmtpEmailTransport implements EmailTransport {
  readonly id = 'smtp';

  constructor(
    private readonly config: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      password: string;
      from: string;
    },
  ) {}

  async send(message: EmailMessage): Promise<{ ok: boolean; info?: string }> {
    void this.config;
    void message;
    throw new Error(
      'SMTP-транспорт не подключён. Установите nodemailer и раскомментируйте реализацию в src/lib/notifications/email/smtp-transport.ts',
    );
  }
}
