'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, deleteProduct } from '@/lib/api';
import { Product, Category } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, [page, categoryId, search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(page, 10, categoryId || undefined, search || undefined);
      setProducts(data.items);
      setTotalPages(data.pages);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    getCategories(1, 100).then(data => setCategories(data.items)).catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Link href="/products/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Новый товар
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded shadow">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Поиск</label>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Название или описание"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="w-64">
          <label className="block text-sm font-medium mb-1">Категория</label>
          <select value={categoryId} onChange={handleCategoryFilter} className="w-full border rounded px-3 py-2">
            <option value="">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div className="text-center py-10">Загрузка...</div>}

      {!loading && products.length === 0 && <p className="text-gray-500">Нет товаров</p>}

      {products.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Название</th>
                  <th className="text-left p-3">Цена</th>
                  <th className="text-left p-3">Наличие</th>
                  <th className="text-left p-3">Категория</th>
                  <th className="text-left p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.price} ₽</td>
                    <td className="p-3">{product.inStock ? 'В наличии' : 'Нет'}</td>
                    <td className="p-3">
                      {categories.find(c => c.id === product.categoryId)?.name || product.categoryId}
                    </td>
                    <td className="p-3 space-x-2">
                      <Link href={`/products/${product.id}/edit`} className="text-blue-600 hover:underline">
                        Редактировать
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Назад
            </button>
            <span className="px-4 py-2">Страница {page} из {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Вперёд
            </button>
          </div>
        </>
      )}
    </div>
  );
}