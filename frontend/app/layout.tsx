import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Магазин товаров',
  description: 'Каталог товаров и категорий',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex flex-wrap gap-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Главная
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600">
              Категории
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600">
              Товары
            </Link>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}