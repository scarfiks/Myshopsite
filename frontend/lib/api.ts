import { Category, Product, PaginatedResponse } from '@/types';

// Базовый URL бэкенда (Express на порту 4000)
const BASE_URL = 'http://localhost:4000/api';

//Категории
export async function getCategories(page = 1, limit = 10): Promise<PaginatedResponse<Category>> {
  // Формируем URL с параметрами пагинации
  const res = await fetch(`${BASE_URL}/categories?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function getCategory(id: string): Promise<Category & { products?: Product[] }> {
  const res = await fetch(`${BASE_URL}/categories/${id}`);
  if (!res.ok) throw new Error('Category not found');
  // Бэкенд возвращает категорию + массив товаров в ней (связь один-ко-многим)
  return res.json();
}

export async function createCategory(data: { name: string; description?: string }): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create category');
  }
  return res.json();
}

// Обновление категории через PATCH (частичное обновление)
export async function updateCategory(id: string, data: { name?: string; description?: string }): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update category');
  }
  return res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete category');
  }
}

//Товары
export async function getProducts(
  page = 1,
  limit = 10,
  categoryId?: string,
  search?: string
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', limit.toString());
  if (categoryId) params.set('categoryId', categoryId);
  if (search) params.set('search', search);
  const res = await fetch(`${BASE_URL}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Получение одного товара с вложенной категорией
export async function getProduct(id: string): Promise<Product & { category?: Category }> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

// Создание товара: обязательны name, price, inStock, categoryId
export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create product');
  }
  return res.json();
}

export async function updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update product');
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete product');
  }
}