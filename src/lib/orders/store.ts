import type { Order } from '@/types';

/**
 * Хранилище заказов.
 *
 * Реализация — в памяти процесса: её достаточно для демонстрации и она
 * намеренно спрятана за интерфейсом. Чтобы подключить БД или CRM, достаточно
 * написать другой класс с теми же методами и вернуть его из `getOrderStore()`;
 * остальной код (API-роуты, письма, страница успеха) менять не нужно.
 */
export interface OrderStore {
  save(order: Order): Promise<void>;
  find(number: string): Promise<Order | null>;
}

class MemoryOrderStore implements OrderStore {
  private readonly orders = new Map<string, Order>();

  async save(order: Order) {
    this.orders.set(order.number, order);
  }

  async find(number: string) {
    return this.orders.get(number) ?? null;
  }
}

const globalForOrders = globalThis as unknown as { __orderStore?: OrderStore };

export function getOrderStore(): OrderStore {
  globalForOrders.__orderStore ??= new MemoryOrderStore();
  return globalForOrders.__orderStore;
}

/** Номер заказа вида ЭК-250819-4821. */
export function createOrderNumber(now = new Date()): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `ЭК-${yy}${mm}${dd}-${rand}`;
}
