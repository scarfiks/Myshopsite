'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, deleteCategory, getProducts } from '@/lib/api';
import { Category, Product } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catsData, prodsData] = await Promise.all([
        getCategories(1, 100),
        getProducts(1, 1000) // загружаем много товаров для подсчёта
      ]);
      setCategories(catsData.items);
      setProducts(prodsData.items);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить категорию? Если в ней есть товары, удаление невозможно.')) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
      await loadData(); // перезагружаем все данные
    } catch (err: any) {
      alert(err.message || 'Ошибка удаления');
    } finally {
      setDeletingId(null);
    }
  };

  // Получаем количество товаров в категории
  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId).length;
  };

  // Выбираем иконку на основе названия категории
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('электрон')) return '📱';
    if (lower.includes('одежд')) return '👕';
    if (lower.includes('книг')) return '📚';
    if (lower.includes('дом') || lower.includes('сад')) return '🏠';
    if (lower.includes('спорт')) return '⚽';
    return '📁';
  };

  if (loading) {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Категории</h1>
        <Link
          href="/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition flex items-center gap-2 shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Новая категория
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="mt-2 text-gray-500">Нет категорий. Создайте первую!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const productCount = getProductCount(cat.id);
            const icon = getCategoryIcon(cat.name);
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col group"
              >
                <div className="p-5 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                          {cat.name}
                        </h2>
                        <div className="flex gap-1">
                          <Link
                            href={`/categories/${cat.id}`}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="Подробнее"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            href={`/categories/${cat.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-800 p-1"
                            title="Редактировать"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={deletingId === cat.id}
                            className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                            title="Удалить"
                          >
                            {deletingId === cat.id ? (
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

                      <p className="text-gray-600 text-sm mt-2">
                        {cat.description || 'Описание отсутствует'}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          📦 {productCount} {productCount === 1 ? 'товар' : 'товаров'}
                        </span>
                        <span className="text-gray-400 text-xs">
                          Создана: {new Date(cat.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                  <Link
                    href={`/products?categoryId=${cat.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    Смотреть все товары
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <span className="text-xs text-gray-400">
                    Обновлена: {new Date(cat.updatedAt || cat.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}