# 🚀 Быстрый старт

## Установка зависимостей

```bash
npm install
```

## Запуск проекта

```bash
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173) в браузере.

## Что уже работает:

✅ **4 страницы:**
- Dashboard (главная с статистикой)
- Kanban (доска задач)
- Calendar (календарь - заглушка)
- All Tasks (все задачи с фильтрами)

✅ **Темы:**
- Светлая (по умолчанию)
- Тёмная
- Переключение в header

✅ **Локализация:**
- Английский (en)
- Русский (ru)
- Китайский (zh - пока на английском)

✅ **Модальные окна:**
- Добавление задачи (кнопка "+ Add Task" на Dashboard)
- Редактирование задачи (клик по карточке)

✅ **Тесты:**
```bash
npm run test:unit
```

## Структура проекта

```
src/
├── assets/         # CSS с темами Vue.js (зелёный + тёмно-синий)
├── components/     # Компоненты
│   ├── common/    # AppCard, TaskCard, ModalContainer
│   ├── dashboard/ # TaskStats
│   └── tasks/     # TaskFormModal
├── composables/   # useTheme, useLocale, useModal
├── i18n/          # Переводы
├── layouts/       # MainLayout с навигацией
├── router/        # Маршруты
├── stores/        # Pinia: tasks, theme, locale, modal
├── types/         # TypeScript типы
└── views/         # Страницы
```

## Следующие шаги

1. Установить FullCalendar для Calendar View:
```bash
npm install @fullcalendar/vue3 @fullcalendar/core @fullcalendar/daygrid
```

2. Добавить drag & drop для Kanban

3. Добавить больше тестов

## Документация

- **CLAUDE.md** - полная документация проекта
- **docs/MODAL_SYSTEM.md** - система модальных окон
- **README.md** - описание проекта
