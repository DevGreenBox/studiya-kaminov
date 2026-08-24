'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { resolveCartLines, cartItemsTotal, cartCount } from '@/lib/cart-lines';
import { promoDiscount, applyPromoCode } from '@/lib/promo';
import { formatPhone, formatPrice, isValidEmail, isValidPhone, pluralize } from '@/lib/format';
import { Input, Textarea, Checkbox } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { DeliveryCalculator } from './DeliveryCalculator';
import { defaultCarrierId, deliveryConfig, legal } from '@/config/site';
import type { DeliveryOption, Order, PromoStatus } from '@/types';
import { cn } from '@/lib/cn';
import { typo } from '@/lib/typography';

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  consent?: string;
  form?: string;
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-line bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-3 text-lg font-bold">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm text-primary">
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useCart((s) => s.hydrated);
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const setPromo = useCart((s) => s.setPromo);
  const clear = useCart((s) => s.clear);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otherRecipient, setOtherRecipient] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [method, setMethod] = useState<'carrier' | 'pickup'>('carrier');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [carrierId, setCarrierId] = useState<string>(defaultCarrierId);
  const [comment, setComment] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<PromoStatus>('idle');
  const [promoMessage, setPromoMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-96" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const lines = resolveCartLines(items);

  if (lines.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={<ShoppingCart size={26} />}
          title="Корзина пока пуста"
          text="Чтобы оформить заказ, сначала выберите камин в каталоге."
          action={{ label: 'Перейти в каталог', href: '/catalog' }}
        />
      </div>
    );
  }

  const itemsTotal = cartItemsTotal(lines);
  const discount = promoDiscount(itemsTotal, promo);
  const selectedOption = deliveryOptions.find((o) => o.carrierId === carrierId);
  const deliveryPrice = method === 'pickup' ? 0 : (selectedOption?.quote.price ?? 0);
  const total = itemsTotal - discount + deliveryPrice;
  const count = cartCount(lines);

  const validate = () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Укажите имя';
    if (!isValidPhone(phone)) next.phone = 'Введите телефон полностью';
    if (!isValidEmail(email)) next.email = 'Проверьте адрес почты';
    if (method === 'carrier') {
      if (city.trim().length < 2) next.city = 'Укажите город';
      if (address.trim().length < 4) next.address = 'Укажите адрес доставки';
    }
    if (!consent) next.consent = 'Нужно согласие на обработку данных';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document
        .querySelector('[aria-invalid="true"]')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    return Object.keys(next).length === 0;
  };

  const applyPromo = () => {
    const result = applyPromoCode(promoInput, promo);
    setPromoStatus(result.status);
    setPromoMessage(result.message);
    if (result.promo) {
      setPromo(result.promo);
      setPromoInput('');
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return; // защита от двойной отправки
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: { name, phone, email },
          recipient: otherRecipient ? { name: recipientName, phone: recipientPhone } : null,
          delivery: {
            method,
            carrierId,
            city,
            address,
            price: deliveryPrice,
            minDays: selectedOption?.quote.minDays,
            maxDays: selectedOption?.quote.maxDays,
            isEstimate: selectedOption?.quote.isEstimate,
          },
          comment,
          promoCode: promo?.code,
          consent,
        }),
      });

      const data = (await response.json()) as { order?: Order; error?: string };
      if (!response.ok || !data.order) throw new Error(data.error ?? 'Не удалось оформить заказ');

      // Заказ доступен странице успеха и после перезагрузки вкладки.
      sessionStorage.setItem('ef-last-order', JSON.stringify(data.order));
      clear();
      router.push('/order/success');
    } catch (error) {
      setSubmitting(false);
      setErrors({ form: error instanceof Error ? error.message : 'Не удалось оформить заказ' });
    }
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10"
    >
      <div className="flex flex-col gap-4">
        <Section step={1} title="Контактные данные">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Имя"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              label="Телефон"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              error={errors.phone}
            />
            <Input
              label="Email"
              required
              type="email"
              autoComplete="email"
              hint="На него придёт подтверждение заказа"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              className="sm:col-span-2"
            />
          </div>

          <div className="mt-4">
            <Checkbox
              label="Заказ получает другой человек"
              checked={otherRecipient}
              onChange={(e) => setOtherRecipient(e.target.checked)}
            />
          </div>

          {otherRecipient && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Имя получателя"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <Input
                label="Телефон получателя"
                type="tel"
                inputMode="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(formatPhone(e.target.value))}
              />
            </div>
          )}
        </Section>

        <Section step={2} title="Доставка">
          <div className="flex flex-col gap-2 sm:flex-row">
            {(
              [
                { value: 'carrier' as const, label: typo('Доставка транспортной компанией') },
                { value: 'pickup' as const, label: 'Самовывоз со склада' },
              ] satisfies { value: 'carrier' | 'pickup'; label: string }[]
            )
              .filter((option) => option.value === 'carrier' || deliveryConfig.pickupAvailable)
              .map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex flex-1 cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3 text-[15px] transition-colors',
                    method === option.value
                      ? 'border-primary bg-primary-soft'
                      : 'border-line-strong bg-white hover:border-ink-muted',
                  )}
                >
                  <input
                    type="radio"
                    name="delivery-method"
                    value={option.value}
                    checked={method === option.value}
                    onChange={() => {
                      setMethod(option.value);
                      setDeliveryOptions([]);
                    }}
                    className="ef-radio h-4 w-4"
                  />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
          </div>

          {method === 'carrier' ? (
            <div className="mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Город"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setDeliveryOptions([]);
                  }}
                  error={errors.city}
                />
                <Input
                  label="Адрес или терминал"
                  required
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  error={errors.address}
                />
              </div>
              <DeliveryCalculator
                city={city}
                items={items}
                options={deliveryOptions}
                selectedCarrierId={carrierId}
                onOptions={setDeliveryOptions}
                onSelect={setCarrierId}
              />
            </div>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {typo(
                'Самовывоз со склада бесплатный. Менеджер согласует дату и адрес после оформления заказа.',
              )}
            </p>
          )}
        </Section>

        <Section step={3} title="Комментарий к заказу">
          <Textarea
            label="Что важно учесть"
            placeholder="Например: удобное время звонка или пожелания по доставке"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Section>

        <Section step={4} title="Подтверждение">
          <Checkbox
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            error={errors.consent}
            label={
              <>
                Согласен на обработку персональных данных в соответствии с{' '}
                <Link
                  href={legal.privacyUrl}
                  className="font-medium text-primary underline underline-offset-2"
                >
                  {typo('политикой конфиденциальности')}
                </Link>
              </>
            }
          />
          {errors.form && (
            <p
              className="mt-4 rounded-[var(--radius-sm)] bg-danger-soft px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {errors.form}
            </p>
          )}
        </Section>
      </div>

      <aside className="lg:sticky lg:top-28">
        <div className="rounded-[var(--radius-md)] border border-line bg-surface p-5">
          <h2 className="text-lg font-bold">Ваш заказ</h2>

          <ul className="mt-4 flex flex-col gap-3">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3">
                <span className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-white">
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-medium leading-snug">{product.name}</span>
                  <span className="mt-0.5 block text-ink-muted">
                    {quantity} × {formatPrice(product.price)}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold whitespace-nowrap">
                  {formatPrice(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>

          {!promo && (
            // Не <form>: этот блок находится внутри формы оформления,
            // а вложенные формы недопустимы в HTML.
            <div className="mt-5 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyPromo();
                    }
                  }}
                  placeholder="Промокод"
                  aria-label="Промокод"
                  className="h-11 min-w-0 flex-1 rounded-[var(--radius-sm)] border border-line-strong bg-white px-3 text-[15px] uppercase outline-none placeholder:normal-case placeholder:text-ink-muted hover:border-ink-muted"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  onClick={applyPromo}
                >
                  Применить
                </Button>
              </div>
              {promoMessage && (
                <p
                  role="status"
                  className={cn(
                    'text-sm',
                    promoStatus === 'applied' ? 'text-success' : 'text-danger',
                  )}
                >
                  {promoMessage}
                </p>
              )}
            </div>
          )}

          <dl className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">
                Товары, {count} {pluralize(count, ['шт', 'шт', 'шт'])}
              </dt>
              <dd className="font-medium whitespace-nowrap">{formatPrice(itemsTotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between gap-4 text-success">
                <dt>Скидка {promo ? `(${promo.code})` : ''}</dt>
                <dd className="font-medium whitespace-nowrap">−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Доставка</dt>
              <dd className="text-right font-medium">
                {method === 'pickup' ? (
                  'самовывоз'
                ) : selectedOption ? (
                  formatPrice(selectedOption.quote.price)
                ) : (
                  <span className="text-sm font-normal text-ink-muted">рассчитает менеджер</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <span className="font-bold">Итого</span>
            <span className="text-2xl font-bold whitespace-nowrap">{formatPrice(total)}</span>
          </div>

          <Button type="submit" size="lg" fullWidth className="mt-5" loading={submitting}>
            {submitting ? 'Оформляем…' : 'Оформить заказ'}
          </Button>

          {method === 'carrier' && !selectedOption && (
            <p className="mt-3 rounded-[var(--radius-xs)] bg-surface-warm px-3 py-2 text-sm leading-relaxed text-ink-soft">
              {typo(
                'Доставка не рассчитана — итог показан без неё. Нажмите «Рассчитать», чтобы увидеть полную сумму, либо оформляйте заказ: стоимость доставки назовёт менеджер.',
              )}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {typo(
              'После оформления менеджер свяжется с вами, чтобы подтвердить состав заказа, стоимость доставки и сроки.',
            )}
          </p>
        </div>
      </aside>
    </form>
  );
}
