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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(page, 12, categoryId || undefined, search || undefined);
      setProducts(data.items);
      setTotalPages(data.pages);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getCategories(1, 100);
      setCategories(cats.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, categoryId, search]);

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
    setDeletingId(id);
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err: any) {
      alert(err.message || 'Ошибка удаления');
    } finally {
      setDeletingId(null);
    }
  };

  const handleBuy = (productName: string) => {
    alert(`Товар "${productName}" добавлен в корзину (демо-режим)`);
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Без категории';
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Товары</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition flex items-center gap-2 shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Новый товар
        </Link>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Название или описание..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
            <select
              value={categoryId}
              onChange={handleCategoryFilter}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Все категории</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h9.5l-1-6M9 21h.01M15 21h.01" />
          </svg>
          <p className="mt-2 text-gray-500">Нет товаров. Создайте первый!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col"
              >
                {/* Иконка-заглушка */}
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1 flex-1">
                      {product.name}
                    </h2>
                    <div className="flex gap-1">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="text-yellow-600 hover:text-yellow-800 p-1"
                        title="Редактировать"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                        title="Удалить"
                      >
                        {deletingId === product.id ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {product.description || 'Без описания'}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">{product.price} ₽</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>

                  {/* Кнопка Купить */}
                  <button
                    onClick={() => handleBuy(product.name)}
                    className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
                  >
                    Купить
                  </button>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                    <span className="truncate max-w-[150px]">
                      {getCategoryName(product.categoryId)}
                    </span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Назад
              </button>
              <span className="px-4 py-2 text-gray-700">
                Страница {page} из {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}