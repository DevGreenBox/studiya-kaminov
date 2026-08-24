import type { DeliveryProvider } from '@/types';
import { MockDeliveryProvider } from './mock-provider';
import { CdekDeliveryProvider } from './cdek-provider';
import { DellinDeliveryProvider } from './dellin-provider';

/**
 * Фабрика провайдера доставки — своя для каждой транспортной компании.
 *
 * Интерфейс отделён от UI: страницы и компоненты вызывают только
 * `POST /api/delivery/calculate`, а какой провайдер стоит за конкретным
 * перевозчиком — вопрос конфигурации. Пока ключей нет, работает
 * демонстрационный расчёт, и кнопка расчёта не становится «мёртвой».
 */
export function getDeliveryProvider(carrierId: string): DeliveryProvider {
  if (process.env.DELIVERY_PROVIDER === 'mock') return new MockDeliveryProvider();

  if (carrierId === 'cdek') {
    const apiUrl = process.env.CDEK_API_URL;
    const account = process.env.CDEK_ACCOUNT;
    const securePassword = process.env.CDEK_SECURE_PASSWORD;
    if (apiUrl && account && securePassword) {
      return new CdekDeliveryProvider({ apiUrl, account, securePassword });
    }
  }

  if (carrierId === 'dellin') {
    const apiUrl = process.env.DELLIN_API_URL;
    const appKey = process.env.DELLIN_APP_KEY;
    const sessionId = process.env.DELLIN_SESSION_ID;
    if (apiUrl && appKey && sessionId) {
      return new DellinDeliveryProvider({ apiUrl, appKey, sessionId });
    }
  }

  return new MockDeliveryProvider();
}

export { MockDeliveryProvider, CdekDeliveryProvider, DellinDeliveryProvider };
