'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Checkbox } from '@/components/ui/Field';
import { formatPhone, isValidEmail, isValidPhone } from '@/lib/format';
import { contacts, legal } from '@/config/site';
import { typo } from '@/lib/typography';

interface Errors {
  name?: string;
  phone?: string;
  email?: string;
  consent?: string;
  form?: string;
}

interface Props {
  title?: string;
  text?: string;
}

/** Форма обратной связи для «О нас» и «Контактов». */
export function ContactSection({
  title = 'Напишите нам',
  text = 'Ответим на вопросы по моделям, размерам и доставке.',
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'loading') return;

    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Укажите имя';
    if (!isValidPhone(phone)) next.phone = 'Введите телефон полностью';
    if (email.trim() && !isValidEmail(email)) next.email = 'Проверьте адрес почты';
    if (!consent) next.consent = 'Нужно согласие на обработку данных';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Не удалось отправить сообщение');
      }
      setStatus('success');
    } catch (error) {
      setStatus('idle');
      setErrors({
        form: error instanceof Error ? error.message : 'Не удалось отправить сообщение',
      });
    }
  };

  return (
    <section className="container-site py-12 sm:py-16">
      <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-9 lg:p-11">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-[clamp(1.5rem,1.2rem+1.3vw,2.125rem)] leading-tight">
              {typo(title)}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {typo(text)}
            </p>
            <dl className="mt-7 flex flex-col gap-3 text-[15px]">
              <div>
                <dt className="text-ink-muted">Телефон</dt>
                <dd>
                  <a
                    href={contacts.phoneHref}
                    className="text-lg font-bold transition-colors hover:text-primary"
                  >
                    {contacts.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Email</dt>
                <dd>
                  <a
                    href={`mailto:${contacts.email}`}
                    className="font-semibold transition-colors hover:text-primary"
                  >
                    {contacts.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Время работы</dt>
                <dd className="font-medium">{typo(contacts.workHours)}</dd>
              </div>
            </dl>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-start justify-center rounded-[var(--radius-md)] border border-line bg-white p-6">
              <CheckCircle2 size={40} className="text-success" aria-hidden />
              <p className="mt-4 text-lg font-bold">Сообщение отправлено</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Мы получили вашу заявку и свяжемся по телефону {phone}.
              </p>
              <Button
                variant="secondary"
                className="mt-5"
                onClick={() => {
                  setName('');
                  setPhone('');
                  setEmail('');
                  setMessage('');
                  setConsent(false);
                  setStatus('idle');
                }}
              >
                Написать ещё раз
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
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
              </div>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                hint="Необязательно"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Textarea
                label="Сообщение"
                placeholder="Какая модель интересует и какие размеры места?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Checkbox
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
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
                <p
                  className="rounded-[var(--radius-sm)] bg-danger-soft px-4 py-3 text-sm text-danger"
                  role="alert"
                >
                  {errors.form}
                </p>
              )}
              <Button type="submit" size="lg" loading={status === 'loading'}>
                {status === 'loading' ? 'Отправляем…' : 'Отправить сообщение'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
