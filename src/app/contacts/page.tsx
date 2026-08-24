import type { Metadata } from 'next';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactSection } from '@/components/forms/ContactSection';
import { contacts, site } from '@/config/site';
import { typo } from '@/lib/typography';

export const metadata: Metadata = {
  title: 'Контакты',
  description: `Как связаться с производителем электрокаминов ${site.name}: телефон, почта, время работы.`,
  alternates: { canonical: '/contacts' },
  openGraph: { title: `Контакты — ${site.name}`, url: '/contacts' },
};

export default function ContactsPage() {
  const messengers = contacts.messengers.flatMap((m) =>
    m.href ? [{ label: m.label, href: m.href }] : [],
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    url: site.url,
    telephone: contacts.phone,
    email: contacts.email,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-site py-6">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]} />

        <h1 className="mt-4 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">Контакты</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {typo(
            'Позвоните или напишите — поможем подобрать модель, рассчитать доставку и оформить заказ.',
          )}
        </p>

        <ul className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li className="rounded-[var(--radius-md)] border border-line bg-white p-5">
            <SketchIcon name="phone" size={22} className="text-primary" aria-hidden />
            <p className="mt-3 text-sm text-ink-muted">Телефон</p>
            <a
              href={contacts.phoneHref}
              className="mt-1 block text-lg font-bold transition-colors hover:text-primary"
            >
              {contacts.phone}
            </a>
          </li>
          <li className="rounded-[var(--radius-md)] border border-line bg-white p-5">
            <SketchIcon name="mail" size={22} className="text-primary" aria-hidden />
            <p className="mt-3 text-sm text-ink-muted">Email</p>
            <a
              href={`mailto:${contacts.email}`}
              className="mt-1 block break-all text-lg font-bold transition-colors hover:text-primary"
            >
              {contacts.email}
            </a>
          </li>
          <li className="rounded-[var(--radius-md)] border border-line bg-white p-5">
            <SketchIcon name="map-pin" size={22} className="text-primary" aria-hidden />
            <p className="mt-3 text-sm text-ink-muted">Адрес</p>
            <p className="mt-1 font-semibold">{typo(contacts.address)}</p>
          </li>
          <li className="rounded-[var(--radius-md)] border border-line bg-white p-5">
            <SketchIcon name="clock" size={22} className="text-primary" aria-hidden />
            <p className="mt-3 text-sm text-ink-muted">Время работы</p>
            <p className="mt-1 font-semibold">{typo(contacts.workHours)}</p>
          </li>
        </ul>

        {(messengers.length > 0 || contacts.socials.length > 0) && (
          <section className="mt-10">
            <h2 className="text-xl font-bold">Мессенджеры и соцсети</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {messengers.map((m) => (
                <li key={m.label}>
                  <a
                    href={m.href}
                    className="inline-flex h-11 items-center rounded-full border border-line-strong bg-white px-5 font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    {m.label}
                  </a>
                </li>
              ))}
              {contacts.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="inline-flex h-11 items-center rounded-full border border-line-strong bg-white px-5 font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 rounded-[var(--radius-sm)] border border-dashed border-line-strong bg-surface px-4 py-3 text-sm leading-relaxed text-ink-muted">
          {typo(
            'Телефон, почта и адрес пока заполнены нейтральными значениями: в исходных материалах их нет. Все контакты меняются в одном файле —',
          )}
          <code>src/config/site.ts</code>. Там же включаются ссылки на мессенджеры и соцсети и
          появляется карта.
        </p>
      </div>

      <ContactSection title="Написать нам" text="Опишите задачу — ответим в рабочее время." />
    </>
  );
}
