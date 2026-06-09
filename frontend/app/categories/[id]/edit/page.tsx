'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCategory, updateCategory } from '@/lib/api';

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const cat = await getCategory(id);
        setName(cat.name);
        setDescription(cat.description || '');
      } catch (err) {
        setError('Категория не найдена');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название обязательно');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateCategory(id, { name: name.trim(), description: description.trim() || undefined });
      router.push('/categories');
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
      <h1 className="text-2xl font-bold mb-6">Редактировать категорию</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Название *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Описание</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={() => router.back()} className="border px-4 py-2 rounded hover:bg-gray-100">Отмена</button>
        </div>
      </form>
    </div>
  );
}