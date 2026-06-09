'use client';   // компонент использует хуки и интерактив

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, deleteCategory } from '@/lib/api';
import { Category } from '@/types';

export default function CategoriesPage() {
  // Состояния: данные, загрузка, ошибка
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      // Для простоты берём много категорий (пагинация не критична)
      const data = await getCategories(1, 100);
      setCategories(data.items);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить категории');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Подтверждение перед удалением (по ТЗ)
    if (!confirm('Вы уверены? Если есть товары, удаление невозможно.')) return;
    try {
      await deleteCategory(id);
      await loadCategories(); // обновляем список
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Link href="/categories/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Новая категория
        </Link>
      </div>
      {categories.length === 0 ? (
        <p className="text-gray-500">Нет категорий</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
              {cat.description && <p className="text-gray-600 mb-3">{cat.description}</p>}
              <div className="flex gap-2">
                <Link href={`/categories/${cat.id}`} className="text-blue-600 hover:underline">Подробнее</Link>
                <Link href={`/categories/${cat.id}/edit`} className="text-yellow-600 hover:underline">Редактировать</Link>
                <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}