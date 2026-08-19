import { promoCodes } from '@/config/site';
import type { AppliedPromo, PromoStatus } from '@/types';

export interface PromoResult {
  status: PromoStatus;
  promo?: AppliedPromo;
  message: string;
}

export function applyPromoCode(input: string, current?: AppliedPromo | null): PromoResult {
  const code = input.trim().toUpperCase();

  if (!code) {
    return { status: 'invalid', message: 'Введите промокод' };
  }

  if (current && current.code === code) {
    return { status: 'already', message: 'Этот промокод уже применён' };
  }

  const found = promoCodes.find((p) => p.code === code);
  if (!found) {
    return { status: 'invalid', message: 'Промокод не найден' };
  }

  if (found.expiresAt && new Date(found.expiresAt).getTime() < Date.now()) {
    return { status: 'expired', message: 'Срок действия промокода истёк' };
  }

  return {
    status: 'applied',
    promo: { code: found.code, percent: found.percent },
    message: `Промокод применён: −${found.percent}%`,
  };
}

export const promoDiscount = (itemsTotal: number, promo?: AppliedPromo | null) =>
  promo ? Math.round((itemsTotal * promo.percent) / 100) : 0;
