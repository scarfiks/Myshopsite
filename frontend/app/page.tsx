import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Магазин товаров и категорий</h1>
      <p className="text-gray-600">
        Учебное приложение для управления категориями и товарами. 
        Используйте навигацию для работы со списками.
      </p>
      <div className="flex gap-4">
        <Link href="/categories" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Категории
        </Link>
        <Link href="/products" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Товары
        </Link>
      </div>
    </div>
  );
}