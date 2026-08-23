import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { site, contacts, legal } from '@/config/site';
import { typo } from '@/lib/typography';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Как обрабатываются персональные данные, оставленные на сайте.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="container-site py-6 lg:py-8">
      <Breadcrumbs
        items={[{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }]}
      />

      <article className="mt-4 max-w-3xl">
        <h1 className="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">
          {typo('Политика конфиденциальности')}
        </h1>

        <div className="mt-6 rounded-[var(--radius-sm)] border border-dashed border-line-strong bg-surface px-4 py-3 text-sm leading-relaxed text-ink-muted">
          {typo(
            'Ниже — рабочий текст-основа. Перед публикацией его должен проверить и утвердить юрист заказчика: сюда добавляются реквизиты оператора, сроки хранения и порядок обращения.',
          )}
        </div>

        <div className="mt-8 flex flex-col gap-8 text-[15px] leading-relaxed text-ink-soft">
          <section>
            <h2 className="text-xl font-bold text-ink">{typo('1. Кто обрабатывает данные')}</h2>
            <p className="mt-3">
              Оператором персональных данных является {site.legalName}. Контакты для обращений:{' '}
              {contacts.phone}, {contacts.email}. Реквизиты: {legal.requisites}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">{typo('2. Какие данные мы собираем')}</h2>
            <p className="mt-3">
              {typo(
                'Мы собираем только те данные, которые вы сами указываете в формах на сайте: имя, номер телефона, адрес электронной почты, город и адрес доставки, а также текст комментария к заказу или сообщения.',
              )}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">{typo('3. Зачем мы их используем')}</h2>
            <p className="mt-3">{typo('Данные используются, чтобы:')}</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5">
              <li>{typo('обработать заказ и связаться с вами для его подтверждения;')}</li>
              <li>{typo('рассчитать и организовать доставку;')}</li>
              <li>{typo('ответить на вопрос, отправленный через форму обратной связи.')}</li>
            </ul>
            <p className="mt-3">
              {typo(
                'Мы не передаём данные третьим лицам, кроме случаев, когда это необходимо для доставки заказа (передача данных получателя транспортной компании) или предусмотрено законом.',
              )}
            </p>
          </section>

          <section id="consent">
            <h2 className="text-xl font-bold text-ink">
              {typo('4. Согласие на обработку данных')}
            </h2>
            <p className="mt-3">
              {typo(
                'Отмечая чекбокс согласия и отправляя форму, вы подтверждаете согласие на обработку указанных персональных данных на условиях этой политики. Согласие можно отозвать, написав на ',
              )}
              {contacts.email}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">{typo('5. Файлы cookie')}</h2>
            <p className="mt-3">
              {typo(
                'Сайт использует технически необходимые файлы cookie и локальное хранилище браузера, чтобы запоминать состав корзины, список избранного и факт закрытия уведомления о cookie. Эти данные хранятся в вашем браузере и не передаются на сервер.',
              )}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">{typo('6. Как мы защищаем данные')}</h2>
            <p className="mt-3">
              {typo(
                'Мы принимаем разумные организационные и технические меры для защиты данных от неправомерного доступа, изменения и распространения.',
              )}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink">{typo('7. Ваши права')}</h2>
            <p className="mt-3">
              {typo(
                'Вы можете запросить сведения об обработке ваших данных, их уточнение, блокирование или удаление. Для этого напишите на ',
              )}
              {contacts.email}
              {typo(' или позвоните по телефону ')}
              {contacts.phone}.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
