import Image from 'next/image';
import Link from 'next/link';
import { SketchIcon } from '@/components/icons/SketchIcon';
import { site, contacts, legal } from '@/config/site';
import { footerNav } from '@/config/navigation';
import { categories } from '@/data/categories';
import { typo } from '@/lib/typography';

const year = new Date().getFullYear();

export function Footer() {
  const messengers = contacts.messengers.flatMap((m) =>
    m.href ? [{ label: m.label, href: m.href }] : [],
  );

  return (
    // Внешнего отступа нет: подвал отделён рамкой и собственным фоном, а
    // любой зазор проявляется полосой основного фона между двумя
    // подкрашенными блоками и читается как дырка в вёрстке.
    <footer className="border-t border-line bg-surface">
      <div className="container-site py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-8">
          <div>
            <Link href="/" className="inline-flex" aria-label={`${site.name} — на главную`}>
              <Image
                src={site.logo}
                alt={site.name}
                width={1002}
                height={436}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink-soft">
              {site.tagline}. Продажа напрямую с производства.
            </p>
          </div>

          <nav aria-labelledby="footer-catalog">
            <h2
              id="footer-catalog"
              className="text-sm font-bold uppercase tracking-wide text-ink-muted"
            >
              Каталог
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/catalog?category=${category.slug}`}
                    className="text-[15px] text-ink-soft transition-colors hover:text-primary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-8">
            <nav aria-labelledby="footer-buyers">
              <h2
                id="footer-buyers"
                className="text-sm font-bold uppercase tracking-wide text-ink-muted"
              >
                Покупателям
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {footerNav.buyers.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[15px] text-ink-soft transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-company">
              <h2
                id="footer-company"
                className="text-sm font-bold uppercase tracking-wide text-ink-muted"
              >
                Компания
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {footerNav.company.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[15px] text-ink-soft transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Контакты</h2>
            <ul className="mt-4 flex flex-col gap-3 text-[15px] text-ink-soft">
              <li>
                <a
                  href={contacts.phoneHref}
                  className="inline-flex items-start gap-2.5 transition-colors hover:text-primary"
                >
                  <SketchIcon
                    name="phone"
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden
                  />
                  {contacts.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contacts.email}`}
                  className="inline-flex items-start gap-2.5 transition-colors hover:text-primary"
                >
                  <SketchIcon
                    name="mail"
                    size={17}
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="break-all">{contacts.email}</span>
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <SketchIcon
                  name="map-pin"
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden
                />
                {typo(contacts.address)}
              </li>
              <li className="inline-flex items-start gap-2.5">
                <SketchIcon
                  name="clock"
                  size={17}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden
                />
                {typo(contacts.workHours)}
              </li>
            </ul>

            {messengers.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {messengers.map((m) => (
                  <li key={m.label}>
                    <a
                      href={m.href}
                      className="inline-flex h-9 items-center rounded-[var(--radius-sm)] border border-line-strong bg-white px-3.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                    >
                      {m.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {contacts.socials.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {contacts.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="inline-flex h-9 items-center rounded-[var(--radius-sm)] border border-line-strong bg-white px-3.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href={legal.privacyUrl} className="transition-colors hover:text-primary">
                {typo('Политика конфиденциальности')}
              </Link>
            </li>
            <li>
              <Link href={legal.consentUrl} className="transition-colors hover:text-primary">
                {typo('Согласие на обработку данных')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
