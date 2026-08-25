import { categories } from '@/data/categories';
import { CategoryCard } from '@/components/catalog/CategoryCard';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function CategoryGrid() {
  return (
    <section className="container-site py-10 sm:py-12">
      <SectionHeader
        title="Выберите камин"
        description="Модели распределены по типам — откройте нужный раздел и сравните исполнения."
        link={{ href: '/catalog', label: 'Весь каталог' }}
      />

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <li key={category.slug}>
            {/* Первые три плитки видны сразу — грузим их без ожидания */}
            <CategoryCard category={category} priority={index < 3} />
          </li>
        ))}
      </ul>
    </section>
  );
}
