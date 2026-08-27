import type { Metadata, Viewport } from 'next';
import { Golos_Text, Lora } from 'next/font/google';
import './globals.css';
import { site } from '@/config/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { ToastProvider } from '@/components/ui/Toast';

/**
 * Две гарнитуры вместо одной — основной инструмент характера.
 *
 * Golos Text — русская гарнитура «Паратайпа»: кириллица здесь родная, а не
 * достроенная к латинице, и текст интерфейса не выглядит переводным.
 * Lora — тёплая книжная антиква с настоящим курсивом, для крупных заголовков.
 * Пара «антиква для эмоции, гротеск для дела» даёт контраст, которого не было,
 * когда весь сайт был набран одним гротеском.
 */
const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-golos',
  // Метрики fallback-шрифта подгоняются автоматически — это убирает скачок при загрузке.
  adjustFontFallback: true,
});

const lora = Lora({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-lora',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: '/',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" className={`${golos.variable} ${lora.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <ToastProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
