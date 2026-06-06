import type { Category, Product } from '../types/type';
import { randomUUID } from 'crypto';

// 1.Хранилище в памяти
export let categories: Category[] = [];
export let products: Product[] = [];


// 2.Функция заполнения тестовыми данными seed
export function seedData() {
    categories = [];
    products = [];

    // 2.1. Создаём 5 категорий
    const categoryNames = [
        'Электроника', 'Одежда', 'Книги', 'Дом и сад', 'Спорт'
    ];
    const now = new Date().toISOString()

    for (const name of categoryNames) {
        const category: Category = {
            id: randomUUID(),
            name: name,
            description: `Категория "${name}"`,
            createdAt: now,
            updatedAt: now,
        } 
        categories.push(category);
    }

    // 2.2. 5 товаров, привязанных к категориям
    const productData = [
    { name: 'Смартфон', price: 25000, inStock: true, desc: 'Мощный смартфон' },
    { name: 'Футболка', price: 1200, inStock: true, desc: 'Хлопковая футболка' },
    { name: 'JavaScript: The Good Parts', price: 1800, inStock: false, desc: 'Книга по JS' },
    { name: 'Газонокосилка', price: 15000, inStock: true, desc: 'Электрическая' },
    { name: 'Футбольный мяч', price: 800, inStock: true, desc: 'Размер 5' }
    ]

      for (let i = 0; i < productData.length; i++) {

    const categoryId = categories[i % categories.length]!.id;
    const data = productData[i]!;

    const product: Product = {
      id: randomUUID(),
      name: data.name,
      price: data.price,
      inStock: data.inStock,
      categoryId: categoryId,
      description: data.desc,
      createdAt: now,
      updatedAt: now,
    };
    products.push(product);
  }
   console.log(`[store] Seeded ${categories.length} categories and ${products.length} products`);
}
// Получить список категорий с пагинацией
export function getAllCategories(limit: number, page: number) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = categories.slice(start, end);
  return {
    items,
    total: categories.length,
    page,
    pages: Math.ceil(categories.length / limit),
  };
}

// Получить одну категорию по ID
export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}

// Создать новую категорию
export function createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
  const now = new Date().toISOString();
  const newCategory: Category = {
    id: randomUUID(),
    ...data,            // name, description (если есть)
    createdAt: now,
    updatedAt: now,
  };
  categories.push(newCategory);
  return newCategory;
}

// Обновить категорию (частичное обновление)
export function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'createdAt'>>
): Category | null {
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;
  const updated = {
    ...categories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  categories[index] = updated;
  return updated;
}

// Удалить категорию (только если нет связанных товаров)
export function deleteCategory(id: string): boolean {
  const hasProducts = products.some(p => p.categoryId === id);
  if (hasProducts) {
    console.warn(`Cannot delete category ${id}: has related products`);
    return false;
  }
  const initialLength = categories.length;
  categories = categories.filter(c => c.id !== id);
  return categories.length < initialLength;
}

// Получить список товаров с пагинацией, фильтрацией по категории и поиском
export function getAllProducts(
  limit: number,
  page: number,
  categoryId?: string,
  search?: string
) {
  let filtered = [...products];

  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === categoryId);
  }
  if (search) {
    const lowerSearch = search.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        (p.description && p.description.toLowerCase().includes(lowerSearch))
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);

  return {
    items,
    total: filtered.length,
    page,
    pages: Math.ceil(filtered.length / limit),
  };
}

// Получить один товар по ID
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

// Создать товар (с проверкой существования категории)
export function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Product | null {
  const categoryExists = categories.some(c => c.id === data.categoryId);
  if (!categoryExists) return null;

  const now = new Date().toISOString();
  const newProduct: Product = {
    id: randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  products.push(newProduct);
  return newProduct;
}

// Обновить товар (частичное обновление)
export function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Product | null {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  // Если обновляется categoryId, проверить, существует ли новая категория
  if (updates.categoryId && !categories.some(c => c.id === updates.categoryId)) {
    return null;
  }

  const updated = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  products[index] = updated;
  return updated;
}

// Удалить товар
export function deleteProduct(id: string): boolean {
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  return products.length < initialLength;
}