'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProduct, updateProduct, getCategories } from '@/lib/api';
import { Category } from '@/types';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [product, cats] = await Promise.all([
          getProduct(id),
          getCategories(1, 100)
        ]);
        setCategories(cats.items);
        setName(product.name);
        setPrice(product.price.toString());
        setInStock(product.inStock);
        setCategoryId(product.categoryId);
        setDescription(product.description || '');
      } catch (err) {
        setError('Не удалось загрузить товар');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Название обязательно');
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return setError('Цена должна быть положительным числом');
    if (!categoryId) return setError('Выберите категорию');
    setSaving(true);
    try {
      await updateProduct(id, {
        name: name.trim(),
        price: priceNum,
        inStock,
        categoryId,
        description: description.trim() || undefined,
      });
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Редактировать товар</h1>
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
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={() => router.back()} className="border px-4 py-2 rounded">Отмена</button>
        </div>
      </form>
    </div>
  );
}