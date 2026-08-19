import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { PromoCarousel } from '@/components/home/PromoCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ProductionBlock } from '@/components/home/ProductionBlock';
import { Advantages } from '@/components/home/Advantages';
import { ReviewsPreview } from '@/components/home/ReviewsPreview';
import { DeliveryBlock } from '@/components/home/DeliveryBlock';
import { HelpCta } from '@/components/home/HelpCta';
import { promotions } from '@/data/promotions';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoCarousel items={promotions} />
      <CategoryGrid />
      <FeaturedProducts />
      <ProductionBlock />
      <Advantages />
      <ReviewsPreview />
      <DeliveryBlock />
      <HelpCta />
    </>
  );
}
