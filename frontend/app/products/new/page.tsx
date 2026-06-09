'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, getCategories } from '@/lib/api';
import { Category } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загружаем список категорий для выбора
  useEffect(() => {
    getCategories(1, 100).then(data => setCategories(data.items)).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Валидация на клиенте (дублирует бэкенд для UX)
    if (!name.trim()) return setError('Название обязательно');
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return setError('Цена должна быть положительным числом');
    if (!categoryId) return setError('Выберите категорию');
    setLoading(true);
    try {
      await createProduct({
        name: name.trim(),
        price: priceNum,
        inStock,
        categoryId,
        description: description.trim() || undefined,
      });
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Ошибка создания');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Новый товар</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Название *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Цена *</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Категория *</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border rounded px-3 py-2" required>
            <option value="">Выберите категорию</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
            В наличии
          </label>
        </div>
        <div>
          <label className="block font-medium mb-1">Описание</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
            {loading ? 'Сохранение...' : 'Создать'}
          </button>
          <button type="button" onClick={() => router.back()} className="border px-4 py-2 rounded">Отмена</button>
        </div>
      </form>
    </div>
  );
}