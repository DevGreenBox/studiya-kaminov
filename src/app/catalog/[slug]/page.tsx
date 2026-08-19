import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, Check, Package, Truck } from 'lucide-react';
import { getColorVariants, getSimilar, products, productBySlug, discountPercent } from '@/data/catalog';
import { categoryBySlug } from '@/data/categories';
import { site, deliveryConfig, contacts } from '@/config/site';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge, DiscountBadge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchase } from '@/components/product/ProductPurchase';
import { MobileBuyBar } from '@/components/product/MobileBuyBar';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/cn';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) return { title: 'Товар не найден' };

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/catalog/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `/catalog/${product.slug}`,
      images: [{ url: product.images[0] }],
      type: 'website',
    },
  };
}

const PURCHASE_ANCHOR = 'purchase-block';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) notFound();

  const category = categoryBySlug.get(product.category);
  const variants = getColorVariants(product);
  const similar = getSimilar(product);
  const discount = discountPercent(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((image) => `${site.url}${image}`),
    sku: product.sku,
    category: category?.name,
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'Offer',
      url: `${site.url}/catalog/${product.slug}`,
      priceCurrency: 'RUB',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: site.name },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${site.url}/catalog` },
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: category.name,
              item: `${site.url}/catalog?category=${category.slug}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 4 : 3,
        name: product.name,
        item: `${site.url}/catalog/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }}
      />

      <div className="container-site pb-24 pt-6 lg:pb-10">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Каталог', href: '/catalog' },
            ...(category ? [{ label: category.name, href: `/catalog?category=${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-12">
          <ProductGallery images={product.images} name={product.name} />

          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <Badge key={badge} kind={badge} />
              ))}
              {discount > 0 && <DiscountBadge percent={discount} />}
            </div>

            <h1 className="mt-3 text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] leading-tight">
              {product.name}
            </h1>

            <p className="mt-2 text-[15px] text-ink-muted">
              {product.sku ? `Артикул: ${product.sku}` : `Модель: ${product.model}`}
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{product.shortDescription}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Price value={product.price} oldValue={product.oldPrice} size="lg" />
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-[15px] font-medium',
                  product.inStock ? 'text-success' : 'text-ink-muted',
                )}
              >
                <Check size={17} aria-hidden />
                {product.inStock ? 'В наличии' : 'Нет в наличии'}
              </span>
            </div>

            {variants.length > 1 && (
              <div className="mt-7">
                <p className="text-sm font-bold uppercase tracking-wide text-ink-muted">
                  Исполнение портала
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <li key={variant.id}>
                      <Link
                        href={`/catalog/${variant.slug}`}
                        aria-current={variant.id === product.id ? 'page' : undefined}
                        className={cn(
                          'inline-flex h-10 items-center rounded-[var(--radius-sm)] border px-3.5 text-sm font-medium transition-colors',
                          variant.id === product.id
                            ? 'border-primary bg-primary-soft text-primary'
                            : 'border-line-strong bg-white text-ink-soft hover:border-ink-muted hover:text-ink',
                        )}
                      >
                        {variant.color}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="mt-7 grid grid-cols-1 gap-2 rounded-[var(--radius-md)] border border-line bg-surface p-4 sm:grid-cols-2">
              {product.specifications.slice(0, 6).map((spec) => (
                <li key={spec.label} className="flex flex-wrap gap-x-2 text-[15px]">
                  <span className="text-ink-muted">{spec.label}:</span>
                  <span className="font-medium">{spec.value}</span>
                </li>
              ))}
            </ul>

            <div id={PURCHASE_ANCHOR} className="mt-7">
              <ProductPurchase product={product} />
            </div>

            <ul className="mt-7 flex flex-col gap-2.5 text-[15px] text-ink-soft">
              <li className="flex items-start gap-2.5">
                <Truck size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                Доставка «{deliveryConfig.carrier}» по России, стоимость рассчитывается при оформлении
              </li>
              <li className="flex items-start gap-2.5">
                <Package size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                Заводская упаковка, крепёж и инструкция в комплекте
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div className="min-w-0">
            <section aria-labelledby="description-heading">
              <h2 id="description-heading" className="text-2xl">
                Описание
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
                {product.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="specs-heading" className="mt-12">
              <h2 id="specs-heading" className="text-2xl">
                Характеристики
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-[15px]">
                  <tbody>
                    {product.specifications.map((spec) => (
                      <tr key={`${spec.label}-${spec.value}`} className="border-b border-line last:border-0">
                        <th scope="row" className="w-1/2 py-3 pr-4 text-left font-normal text-ink-muted align-top">
                          {spec.label}
                        </th>
                        <td className="py-3 font-medium align-top">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {product.dataNotes && product.dataNotes.length > 0 && (
                <div className="mt-5 flex gap-3 rounded-[var(--radius-sm)] border border-line bg-surface px-4 py-3">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-ink-muted" aria-hidden />
                  <div className="text-sm leading-relaxed text-ink-soft">
                    <p className="font-semibold text-ink">Требует подтверждения заказчиком</p>
                    <ul className="mt-1 flex list-disc flex-col gap-1 pl-4">
                      {product.dataNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:pt-1">
            <div className="rounded-[var(--radius-md)] border border-line bg-surface p-5">
              <h2 className="text-lg font-bold">Доставка и оплата</h2>
              <ul className="mt-3 flex flex-col gap-2.5 text-[15px] leading-relaxed text-ink-soft">
                <li>Отправка транспортной компанией «{deliveryConfig.carrier}» по всей России.</li>
                <li>Стоимость доставки рассчитывается при оформлении заказа по городу получателя.</li>
                {deliveryConfig.pickupAvailable && <li>Возможен самовывоз со склада.</li>}
                <li>Точную сумму и сроки подтверждает менеджер после оформления.</li>
              </ul>
              <Link
                href="/delivery"
                className="mt-4 inline-block font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                Условия доставки и оплаты
              </Link>
              <hr className="my-5 border-line" />
              <p className="text-[15px] text-ink-soft">Остались вопросы по модели?</p>
              <a
                href={contacts.phoneHref}
                className="mt-1 inline-block text-lg font-bold transition-colors hover:text-primary"
              >
                {contacts.phone}
              </a>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section aria-label="Похожие модели" className="mt-16">
            <SectionHeader title="Похожие модели" link={{ href: '/catalog', label: 'Весь каталог' }} />
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {similar.map((item) => (
                <li key={item.id} className="flex">
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <MobileBuyBar product={product} anchorId={PURCHASE_ANCHOR} />
    </>
  );
}
