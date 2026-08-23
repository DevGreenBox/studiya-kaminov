import type { DeliveryProvider, DeliveryQuote, DeliveryRequest } from '@/types';
import { deliveryConfig } from '@/config/site';

/**
 * Заготовка боевого провайдера «Деловых Линий».
 *
 * Ключи не выдуманы и не зашиты в код — они читаются из переменных окружения
 * (см. .env.example). Пока переменные не заданы, фабрика в ./index.ts этот
 * провайдер не выбирает и сайт работает на mock-провайдере.
 *
 * Что потребуется для подключения:
 *   DELLIN_APP_KEY     — ключ приложения из личного кабинета,
 *   DELLIN_SESSION_ID  — идентификатор сессии (авторизация),
 *   DELIVERY_ORIGIN_CITY — город отправления (склад производства).
 *
 * Метод расчёта: POST {DELLIN_API_URL}/v2/calculator.json
 */
export class DellinDeliveryProvider implements DeliveryProvider {
  readonly id = 'dellin';

  constructor(
    private readonly config: {
      apiUrl: string;
      appKey: string;
      sessionId: string;
    },
  ) {}

  async calculate(input: DeliveryRequest): Promise<DeliveryQuote> {
    const response = await fetch(`${this.config.apiUrl}/v2/calculator.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appkey: this.config.appKey,
        sessionID: this.config.sessionId,
        delivery: {
          deliveryType: { type: 'auto' },
          derival: { city: input.originCity },
          arrival: { city: input.destinationCity },
        },
        cargo: {
          quantity: 1,
          length: input.maxDimensions.depth / 1000,
          width: input.maxDimensions.width / 1000,
          height: input.maxDimensions.height / 1000,
          weight: input.weight,
          totalVolume: input.volume,
          totalWeight: input.weight,
          insurance: input.declaredValue,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Сервис расчёта доставки недоступен (${response.status})`);
    }

    const data = (await response.json()) as {
      data?: {
        price?: number;
        orderDates?: { derivalToOsplGiver?: string; arrivalToOspReceiver?: string };
      };
    };

    const price = data.data?.price;
    if (typeof price !== 'number') {
      throw new Error('Сервис расчёта доставки вернул неожиданный ответ');
    }

    return {
      carrier: deliveryConfig.carrier,
      price: Math.round(price),
      minDays: 1,
      maxDays: 1,
      isEstimate: false,
    };
  }
}
