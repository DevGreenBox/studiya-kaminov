import type { DeliveryProvider } from '@/types';
import { MockDeliveryProvider } from './mock-provider';
import { DellinDeliveryProvider } from './dellin-provider';

/**
 * Фабрика провайдера доставки.
 *
 * Интерфейс отделён от UI: страницы и компоненты вызывают только
 * `POST /api/delivery/calculate`, а какой провайдер стоит за ним — вопрос
 * конфигурации. Подключение реального API «Деловых Линий» не требует правок
 * в интерфейсе.
 */
export function getDeliveryProvider(): DeliveryProvider {
  const kind = process.env.DELIVERY_PROVIDER ?? 'mock';

  if (kind === 'dellin') {
    const apiUrl = process.env.DELLIN_API_URL;
    const appKey = process.env.DELLIN_APP_KEY;
    const sessionId = process.env.DELLIN_SESSION_ID;

    if (apiUrl && appKey && sessionId) {
      return new DellinDeliveryProvider({ apiUrl, appKey, sessionId });
    }

    console.warn(
      '[delivery] DELIVERY_PROVIDER=dellin, но не заданы DELLIN_API_URL / DELLIN_APP_KEY / DELLIN_SESSION_ID. Используется mock-провайдер.',
    );
  }

  return new MockDeliveryProvider();
}

export { MockDeliveryProvider, DellinDeliveryProvider };
