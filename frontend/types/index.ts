export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  categoryId: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

// Для ответов с пагинацией
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}