import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { KNOWLEDGE_BASE_STRUCTURE_PROMPT, PRICING_RULES_PROMPT, DIALOG_EXAMPLE } from './prompts.js';

// Определение констант (ранее в constants.ts)
const PRODUCT_TYPES = ['Коробка', 'Пакет бумажный', 'Тишью бумага'];
const BOX_TYPES = ['Самосборная', 'Крышка-дно', 'Пенал'];
const MATERIALS = ['Мелованная бумага', 'Гофрокартон Т23 БЕЛЫЙ', 'Бумага Futbort', 'Тишью', 'Картон', 'Специальная/дизайнерская бумага', 'Крафт-бумага'];
const PRINT_TYPES = ['Офсетная печать', 'Флексография', 'Цифровая печать', 'Шелкография'];
const FINISH_TYPES = ['Матовая ламинация', 'Глянцевая ламинация', 'Soft-touch ламинация', 'УФ-лак (выборочный/сплошной)', 'Тиснение (фольгой/конгрев)', 'Вырубка'];
const HANDLE_TYPES = ['Лента репсовая', 'Веревочные', 'Бумажные', 'Вырубная ручка'];
const HANDLE_ATTACHMENTS = ['Вклеенные', 'На люверсах'];

// Функция для парсинга CSV-строки
function parseCSV(csvString) {
  const lines = csvString.trim().split('\n');
  const csvRegex = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g;

  const parseLine = (line) => {
    const values = [];
    let match;
    while ((match = csvRegex.exec(line)) !== null) {
      if (match[1] !== undefined) {
        values.push(match[1].replace(/""/g, '"'));
      } else if (match[2] !== undefined) {
        values.push(match[2]);
      } else {
        values.push('');
      }
    }
    return values.map(value => value.trim());
  };

  const headers = parseLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] !== undefined ? values[j] : '';
    }
    data.push(row);
  }
  return data;
}

const app = new Hono();

// Настройка CORS
app.use('/*', cors());

// Обработка запросов к Gemini
app.post('/api/ask', async (c) => {
  try {
    console.log("Received /api/ask request");
    const { message } = await c.req.json();
    console.log("Message received: ", message);
    
    // Проверяем наличие API ключа
    if (!c.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not defined in environment variables");
      return c.json({ error: "API key is not configured" }, 500);
    }
    
    const genAI = new GoogleGenerativeAI(c.env.GOOGLE_API_KEY);
    console.log("GoogleGenerativeAI initialized.");
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    console.log("Gemini model obtained.");
    
    // Получение и парсинг базы знаний из KV
    let historicalOrdersPrompt = '';
    if (c.env.ORDERS_KB) {
      const ordersCsv = await c.env.ORDERS_KB.get('orders_data');
      if (ordersCsv) {
        const ordersData = parseCSV(ordersCsv);
        historicalOrdersPrompt = `\nПримеры предыдущих заказов (в формате CSV, для справки):
${ordersCsv}

`;
      }
    }

    const combinedPrompt = `
${KNOWLEDGE_BASE_STRUCTURE_PROMPT}

${PRICING_RULES_PROMPT}

${historicalOrdersPrompt}
Вы являетесь высококвалифицированным экспертом по расчету стоимости упаковки. Ваша ОСНОВНАЯ ЗАДАЧА и приоритет - тщательно анализировать ЗАПРОСЫ КЛИЕНТОВ, извлекать из них ВСЕ релевантные детали заказа на упаковку и предоставлять предварительный расчет стоимости. Вы ОБЯЗАНЫ использовать всю доступную информацию для формирования максимально точного ответа, основываясь на вашей базе знаний и правилах ценообразования.

Когда клиент описывает заказ, ваша цель - определить следующие параметры:
*   **Тип упаковки:** (Например, Пакет бумажный, Коробка, Бирка)
*   **Материал:** (Например, Мелованная бумага, Гофрокартон Т23 БЕЛЫЙ, Тишью, Специальная бумага)
*   **Плотность материала (г/м²):** (Если указана, например, 280)
*   **Ширина (мм):** (Если указана, например, 360)
*   **Высота (мм):** (Если указана, например, 270)
*   **Глубина (мм):** (Если указана, например, 180)
*   **Количество (шт):** (Например, 1000)
*   **Тип печати:** (Например, Офсетная печать, Обычная печать логотипа)
*   **Отделка:** (Например, Soft-touch ламинация, УФ-лак, Тиснение)
*   **Фурнитура/Ручки:** (Например, Ручки не нужны, Люверсы, Лента репсовая)
*   **Цвет:** (Например, Темно-серый, Внутри пакет белый)
*   **Доп. информация:** (Любые другие примечания, влияющие на расчет)

**Важные правила поведения:**
1.  **Всегда старайтесь извлечь максимальное количество деталей** из запроса клиента, даже если они не указаны явно или находятся в свободной форме. Если информация отсутствует (или не может быть разумно выведена), указывайте "Не указано" или "По умолчанию" для соответствующего параметра. НЕ ОТКАЗЫВАЙТЕСЬ от обработки, если хоть какая-то информация об упаковке присутствует.
2.  **Отвечайте ТОЛЬКО в указанном формате**, не добавляйте лишний текст до или после него.
3.  **Условие для отказа:** Вы отвечаете "Извините, я предназначен только для расчетов стоимости упаковки.", ТОЛЬКО если запрос абсолютно не относится к расчетам упаковки (например, "Привет, как дела?", "Какой сегодня курс доллара?"). В ЛЮБОМ ДРУГОМ СЛУЧАЕ вы должны попытаться извлечь детали и предоставить расчет.

${DIALOG_EXAMPLE}

Формат ответа, который вы ДОЛЖНЫ использовать:

# 📦 Расчет стоимости упаковки

## 📋 Детали заказа:
*   **Тип упаковки:** [Например, Пакет из медной бумаги]
*   **Материал:** [Например, Медная бумага, 280 г/м²]
*   **Внутренняя часть:** [Например, Белая]
*   **Печать:** [Например, Обычная печать логотипа (требуется макет для точной оценки)]
*   **Ламинация:** [Например, Сенсорная (soft-touch) пленка]
*   **Отверстия под ручки:** [Например, Диаметр 6 мм]
*   **Ручки:** [Например, Не нужны]
*   **Цвет:** [Например, Темно-серый]
*   **Размер:** [Например, 36 см (ширина) × 27 см (высота) × 18 см (глубина)]
*   **Количество:** [Например, 1000 штук]
*   **Доп. информация:** [Например, Логотип - обычная печать]
`;

    const result = await model.generateContent(combinedPrompt + "\n\nЗапрос клиента: " + message);
    const response = await result.response;
    const text = response.text();
    
    return c.json({ response: text });
  } catch (error) {
    console.error("Error in /api/ask:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Получение логов
app.get('/api/logs', async (c) => {
  try {
    const logs = [];
    const list = await c.env.LOGS.list();
    
    for (const key of list.keys) {
      const value = await c.env.LOGS.get(key.name);
      if (value) {
        logs.push(JSON.parse(value));
      }
    }
    
    return c.json({ logs });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Обработка обратной связи
app.post('/api/feedback', async (c) => {
  try {
    const { requestId, actualPrice } = await c.req.json();
    const log = await c.env.LOGS.get(requestId);
    
    if (log) {
      const logData = JSON.parse(log);
      logData.feedback = actualPrice;
      await c.env.LOGS.put(requestId, JSON.stringify(logData));
      return c.json({ success: true });
    }
    
    return c.json({ error: 'Log not found' }, 404);
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app; 