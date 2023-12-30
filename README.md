# Back-end to manage common requests for shoes store

## Бек-енд застосунок для магазину взуття

## Матеріали та інструменти

- [Node.js](https://nodejs.org/en) - програмна платформа для створення серверної
  частини
- [Express.js](https://expressjs.com/ru/) - веб-фреймворк для Node.js
- [Mongoose](https://mongoosejs.com/docs/guide.html) - з метою моделювання
  об’єктів mongodb для node.js
- [MongoDB](https://www.mongodb.com/) - програма для баз даних NoSQL
- деплой-сервер - [deploy server](https://restowaves-backend.onrender.com)

- додаткові пакети:
  - [google-spreadsheet](https://theoephraim.github.io/node-google-spreadsheet/#/) -
    для отримання списку товарів з Google таблиць
  - [node-cron](https://github.com/node-cron/node-cron) - бібліотека для запуску
    завдань в регулярному режимі з метою для автоматизації імпорту даних з
    Google Sheets до бази даних.
  - [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs) -
    бібліотека для автентифікації в сервісах Google, зокрема, для взаємодії з
    API Google Sheets

## Для локальної роботи з репозиторієм

1. Склонувати репозиторій:

```bash
git https://github.com/Oleh-Kliapko/RestoWaves-test-task.git
```

2. Встановити усі пакети та залежності:

```bash
npm install
```

3. Сторити файл змінних оточення `.env`, заповнити його необхідними змінними.
   Змінні показані у файлі `.env.example`
4. Запусти режим розробки, виконавши команду

```bash
npm run dev
```

## Для для демонстрації роботи застосунку

Використовуйте `postman_collection.json` - імпортуйте в Postman та
використовуйте ендпойнти в папці `Render.com`

## Структура проекту

- **controllers:** Містить обробники маршрутів для різних API-точок.
- **helpers:** Включає допоміжні функції.
- **middlewares:** Включає проміжні програми для різних перевірок перед запуском
  контролерів.
- **models:** Визначає моделі Mongoose для схеми MongoDB.
- **routes:** Визначає маршрути API за допомогою Express.js.
- **services:** Містить зовнішні служби, такі як отримання даних з Google
  Sheets.

## Використання інформації з Google Sheets

Цей проект включає можливість імпорту даних про моделі товарів з Google Sheets.
Для цього використовується пакет `google-spreadsheet`, який надає можливість
взаємодії з Google Sheets API. Отримані дані із Google Sheets обробляються та
імпортуються в базу даних MongoDB. При цьому реалізована логіка оновлення
існуючих записів та додавання нових, забезпечуючи актуальність інформації в
базі.

### Важливо

Перед використанням функціоналу імпорту з Google Sheets, переконайтеся, що ви
правильно налаштували конфіденційні дані, необхідні для взаємодії з Google API,
та що вони збережені в файлі `.env` вашого проекту.
