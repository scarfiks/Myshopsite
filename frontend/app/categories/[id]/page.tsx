'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCategory } from '@/lib/api';
import { Category, Product } from '@/types';

export default function CategoryDetailPage() {
  const { id } = useParams() as { id: string };
  const [category, setCategory] = useState<(Category & { products?: Product[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCategory(id);
        setCategory(data);
      } catch (err) {
        setError('Категория не найдена');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;
  if (!category) return null;

  return (
    <div>
      <div className="mb-4">
        <Link href="/categories" className="text-blue-600 hover:underline">← Назад к списку</Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && <p className="text-gray-600 mb-4">{category.description}</p>}
        <p className="text-sm text-gray-400">Создана: {new Date(category.createdAt).toLocaleString()}</p>
        {category.updatedAt && <p className="text-sm text-gray-400">Обновлена: {new Date(category.updatedAt).toLocaleString()}</p>}
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Товары в этой категории</h2>
        {category.products && category.products.length > 0 ? (
          <div className="grid gap-3">
            {category.products.map((product) => (
              <div key={product.id} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="ml-2 text-sm text-gray-500">{product.price} ₽</span>
                  <span className={product.inStock ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                    {product.inStock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </div>
                <Link href={`/products/${product.id}/edit`} className="text-blue-600 text-sm">Редактировать</Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">В этой категории пока нет товаров.</p>
        )}
      </div>
    </div>
  );
}