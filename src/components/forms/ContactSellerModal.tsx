'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Checkbox } from '@/components/ui/Field';
import { formatPhone, isValidEmail, isValidPhone } from '@/lib/format';
import { legal } from '@/config/site';
import { CheckCircle2 } from 'lucide-react';
import { typo } from '@/lib/typography';

interface Props {
  onClose: () => void;
  /** Название товара подставляется автоматически, если форма открыта из карточки. */
  productName?: string;
}

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  consent?: string;
  form?: string;
}

export function ContactSellerModal({ onClose, productName }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const validate = () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Укажите имя';
    if (!isValidPhone(phone)) next.phone = 'Введите телефон полностью';
    if (email.trim() && !isValidEmail(email)) next.email = 'Проверьте адрес почты';
    if (!consent) next.consent = 'Нужно согласие на обработку данных';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'loading') return; // защита от двойного клика
    if (!validate()) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message, productName }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Не удалось отправить заявку');
      }
      setStatus('success');
    } catch (error) {
      setStatus('idle');
      setErrors({ form: error instanceof Error ? error.message : 'Не удалось отправить заявку' });
    }
  };

  const reset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setConsent(false);
    setStatus('idle');
    onClose();
  };

  return (
    <Modal
      open
      onClose={reset}
      title={status === 'success' ? 'Заявка отправлена' : 'Связаться с продавцом'}
    >
      {status === 'success' ? (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 size={44} className="text-success" aria-hidden />
          <p className="mt-4 text-lg font-bold">{typo('Спасибо, заявка отправлена')}</p>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            {productName
              ? `Мы получили вопрос по товару «${productName}» и свяжемся с вами по указанному телефону.`
              : 'Мы получили вашу заявку и свяжемся с вами по указанному телефону.'}
          </p>
          <Button className="mt-6" onClick={reset}>
            Закрыть
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          {productName && (
            <div className="rounded-[var(--radius-sm)] border border-line bg-surface px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-ink-muted">Интересующий товар</p>
              <p className="mt-0.5 font-semibold">{productName}</p>
            </div>
          )}

          <Input
            label="Имя"
            required
            value={name}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
          />
          <Input
            label="Телефон"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            placeholder="+7 (___) ___-__-__"
            onChange={(event) => setPhone(formatPhone(event.target.value))}
            error={errors.phone}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            hint="Необязательно"
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />
          <Textarea
            label="Сообщение"
            value={message}
            placeholder="Что хотите уточнить?"
            onChange={(event) => setMessage(event.target.value)}
          />
          <Checkbox
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            error={errors.consent}
            label={
              <>
                Согласен на обработку персональных данных в соответствии с{' '}
                <a
                  href={legal.privacyUrl}
                  className="font-medium text-primary underline underline-offset-2"
                >
                  {typo('политикой конфиденциальности')}
                </a>
              </>
            }
          />

          {errors.form && (
            <p className="rounded-[var(--radius-sm)] bg-danger-soft px-4 py-3 text-sm text-danger">
              {errors.form}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth loading={status === 'loading'}>
            {status === 'loading' ? 'Отправляем…' : 'Отправить заявку'}
          </Button>
        </form>
      )}
    </Modal>
  );
}
