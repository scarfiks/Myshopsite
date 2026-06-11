import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Магазин товаров и категорий',
  description: 'Учебное приложение для управления категориями и товарами',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <nav className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex flex-wrap gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Главная
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition">
              Категории
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
              Товары
            </Link>
          </div>
        </nav>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Магазин товаров и категорий. Учебный проект.</p>
            <p className="text-gray-400 text-sm mt-1">
              В рамках курса по клиент-серверной разработке
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}