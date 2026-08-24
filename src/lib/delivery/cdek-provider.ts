import type { DeliveryProvider, DeliveryQuote, DeliveryRequest } from '@/types';
import { carrierById } from '@/config/site';

/**
 * Заготовка боевого провайдера СДЭК.
 *
 * Ключи не выдуманы и не зашиты в код — они читаются из переменных окружения
 * (см. .env.example). Пока переменные не заданы, фабрика в ./index.ts этот
 * провайдер не выбирает и сайт работает на mock-провайдере.
 *
 * Что потребуется для подключения:
 *   CDEK_ACCOUNT       — идентификатор клиента из личного кабинета,
 *   CDEK_SECURE_PASSWORD — пароль интеграции,
 *   DELIVERY_ORIGIN_CITY — город отправления.
 *
 * Расчёт: POST {CDEK_API_URL}/v2/calculator/tarifflist, предварительно нужно
 * получить токен через POST /v2/oauth/token.
 */
export class CdekDeliveryProvider implements DeliveryProvider {
  readonly id = 'cdek';

  constructor(
    private readonly config: {
      apiUrl: string;
      account: string;
      securePassword: string;
    },
  ) {}

  private async token(): Promise<string> {
    const response = await fetch(`${this.config.apiUrl}/v2/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.account,
        client_secret: this.config.securePassword,
      }),
    });
    if (!response.ok) throw new Error('СДЭК: не удалось получить токен');
    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) throw new Error('СДЭК: ответ без токена');
    return data.access_token;
  }

  async calculate(input: DeliveryRequest): Promise<DeliveryQuote> {
    const token = await this.token();

    const response = await fetch(`${this.config.apiUrl}/v2/calculator/tarifflist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        from_location: { city: input.originCity },
        to_location: { city: input.destinationCity },
        packages: [
          {
            weight: Math.round(input.weight * 1000),
            length: Math.round(input.maxDimensions.depth / 10),
            width: Math.round(input.maxDimensions.width / 10),
            height: Math.round(input.maxDimensions.height / 10),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`СДЭК: сервис расчёта недоступен (${response.status})`);
    }

    const data = (await response.json()) as {
      tariff_codes?: { delivery_sum: number; period_min: number; period_max: number }[];
    };

    // Берём самый дешёвый доступный тариф.
    const cheapest = data.tariff_codes?.slice().sort((a, b) => a.delivery_sum - b.delivery_sum)[0];
    if (!cheapest) throw new Error('СДЭК: подходящих тарифов не найдено');

    return {
      carrier: carrierById('cdek')?.name ?? 'СДЭК',
      price: Math.round(cheapest.delivery_sum),
      minDays: cheapest.period_min,
      maxDays: cheapest.period_max,
      isEstimate: false,
    };
  }
}
