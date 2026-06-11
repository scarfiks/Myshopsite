import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Герой-секция */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-12 shadow-lg">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Магазин товаров и категорий
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Удобное управление каталогом: создавайте категории, добавляйте товары,
            фильтруйте и находите нужное за секунды.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/categories"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md"
            >
              Управлять категориями
            </Link>
            <Link
              href="/products"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Перейти к товарам
            </Link>
          </div>
        </div>
      </section>

      {/* Карточки возможностей */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-blue-600 text-3xl mb-3">📁</div>
          <h2 className="text-xl font-semibold mb-2">Категории</h2>
          <p className="text-gray-600">
            Создавайте, редактируйте и удаляйте категории. При удалении категории
            товары сохраняются – система предупредит, если категория не пуста.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-green-600 text-3xl mb-3">🛍️</div>
          <h2 className="text-xl font-semibold mb-2">Товары</h2>
          <p className="text-gray-600">
            Управляйте ассортиментом: цена, наличие, описание. Быстрый поиск и
            фильтрация по категориям.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-purple-600 text-3xl mb-3">🔍</div>
          <h2 className="text-xl font-semibold mb-2">Поиск и фильтрация</h2>
          <p className="text-gray-600">
            Мгновенный поиск по названиям и описанию, фильтр по категории,
            пагинация для удобной навигации.
          </p>
        </div>
      </div>

      {/* Призыв к действию */}
      <div className="mt-12 bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-700 text-lg">
          Готовы начать? Используйте меню или кнопки выше.
        </p>
      </div>
    </>
  );
}