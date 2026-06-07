import express from 'express';
import cors from 'cors';
import { 
  seedData,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from './store/memoryStore';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Заполняем базу тестовыми данными
seedData();

// Здоровье и корень 
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/', (req, res) => {
  res.send(
    '<h2>Backend API server is running.</h2>\n<p>проверить работоспособность <a href="/api/health">backend</a></p>'
  );
});

//Категории
app.get('/api/categories', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = getAllCategories(limit, page);
  res.json(result);
});


app.get('/api/categories/:id', (req, res) => {
  const id = req.params.id;
  const category = getCategoryById(id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  // Возвращаем категорию с товарами (связь один-ко-многим)
  const categoryProducts = getAllProducts(100, 1, id).items;
  res.json({ ...category, products: categoryProducts });
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(422).json({ error: 'name is required and must be a string' });
  }
  const newCategory = createCategory({ name, description });
  res.status(201).json(newCategory);
});


app.patch('/api/categories/:id', (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const updated = updateCategory(id, { name, description });
  if (!updated) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(updated);
});


app.delete('/api/categories/:id', (req, res) => {
  const id = req.params.id;
  const deleted = deleteCategory(id);
  if (!deleted) {
    return res.status(400).json({ error: 'Cannot delete category with existing products or category not found' });
  }
  res.status(204).send();
});

//Товары

app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const categoryId = req.query.categoryId as string | undefined;
  const search = req.query.search as string | undefined;
  const result = getAllProducts(limit, page, categoryId, search);
  res.json(result);
});


app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = getProductById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  // Добавляем информацию о категории (связанная сущность)
  const category = getCategoryById(product.categoryId);
  res.json({ ...product, category });
});


app.post('/api/products', (req, res) => {
  const { name, price, inStock, categoryId, description } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(422).json({ error: 'name is required and must be a string' });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(422).json({ error: 'price must be a positive number' });
  }
  if (typeof inStock !== 'boolean') {
    return res.status(422).json({ error: 'inStock must be a boolean' });
  }
  if (!categoryId || typeof categoryId !== 'string') {
    return res.status(422).json({ error: 'categoryId is required' });
  }
  const newProduct = createProduct({ name, price, inStock, categoryId, description });
  if (!newProduct) {
    return res.status(422).json({ error: 'Category does not exist' });
  }
  res.status(201).json(newProduct);
});


app.patch('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, price, inStock, categoryId, description } = req.body;
  const updated = updateProduct(id, { name, price, inStock, categoryId, description });
  if (!updated) {
    return res.status(404).json({ error: 'Product not found or invalid categoryId' });
  }
  res.json(updated);
});

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const deleted = deleteProduct(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.status(204).send();
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});