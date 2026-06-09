'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory } from '@/lib/api';

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название категории обязательно');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createCategory({ name: name.trim(), description: description.trim() || undefined });
      router.push('/categories');  // редирект после успеха
    } catch (err: any) {
      setError(err.message || 'Ошибка создания');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Создать категорию</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Название *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Сохранение...' : 'Создать'}
          </button>
          <button type="button" onClick={() => router.back()} className="border px-4 py-2 rounded">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}