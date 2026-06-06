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