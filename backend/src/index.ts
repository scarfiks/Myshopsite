import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());          // разрешаем запросы с фронтенда (http://localhost:3000)
app.use(express.json());  // парсим JSON в теле запроса

// Простой тестовый маршрут, чтобы проверить, что сервер работает
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});
app.get('/', (req, res) => {
  res.send(
    '<h2>Backend API server is running.</h2>\n<p>проверить работоспособность <a href="/api/health">backend</a> </p>'
  );
});
// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});