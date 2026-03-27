# Task Flow - Контекст проекта для Claude

## 📋 Описание проекта

Task Flow - это современное приложение для управления задачами на Vue 3 + TypeScript. Проект создан для изучения Vue.js и включает основные концепции фреймворка.

## 🎯 Основные возможности

1. **Dashboard** - дашборд с виджетами статистики задач
2. **Kanban** - канбан-доска с drag & drop для управления задачами
3. **Calendar** - календарь задач на базе FullCalendar
4. **All Tasks** - список всех задач с фильтрацией

## 🏗️ Архитектура проекта

```
src/
├── assets/           # Статические файлы (стили, изображения)
├── components/       # Переиспользуемые компоненты
│   ├── common/      # Общие UI компоненты (кнопки, карточки, модалки)
│   ├── dashboard/   # Компоненты дашборда (виджеты статистики)
│   ├── kanban/      # Компоненты канбан-доски (колонки, карточки)
│   └── tasks/       # Компоненты списка задач (фильтры, элементы)
├── composables/     # Vue Composables (переиспользуемая логика)
│   ├── useTheme.ts     # Управление темами
│   ├── useLocale.ts    # Управление локализацией
│   └── useTasks.ts     # Логика работы с задачами
├── i18n/            # Интернационализация
│   ├── index.ts        # Конфигурация i18n
│   └── locales/        # Переводы (en, ru, zh)
├── layouts/         # Layout компоненты
│   └── MainLayout.vue  # Основной layout с навигацией
├── router/          # Vue Router
│   └── index.ts        # Конфигурация маршрутов
├── stores/          # Pinia хранилища
│   ├── tasks.ts        # Store для задач
│   ├── theme.ts        # Store для темы
│   └── locale.ts       # Store для локали
├── types/           # TypeScript типы
│   ├── task.ts         # Типы задач, статусов, приоритетов
│   └── app.ts          # Общие типы приложения
├── utils/           # Вспомогательные функции
│   └── date.ts         # Утилиты для работы с датами
├── views/           # Страницы приложения
│   ├── DashboardView.vue
│   ├── KanbanView.vue
│   ├── CalendarView.vue
│   └── TasksView.vue
├── App.vue          # Корневой компонент
└── main.ts          # Точка входа
```

## 🎨 Технологический стек

- **Vue 3** - прогрессивный JavaScript фреймворк
- **TypeScript** - типизированный JavaScript
- **Vite** - быстрый сборщик
- **Pinia** - state management
- **Vue Router** - роутинг
- **Vue I18n** - интернационализация
- **FullCalendar** - календарь
- **Vitest** - тестирование
- **@vueuse/core** - утилиты для Vue

## 🎨 Темы

Приложение поддерживает несколько тем:
- **Light** - светлая тема
- **Dark** - тёмная тема
- Архитектура позволяет легко добавлять новые темы

Темы реализованы через CSS переменные в `src/assets/themes/`.

## 🌍 Локализация

Поддерживаемые языки:
- **English (en)** - английский
- **Русский (ru)** - русский
- **中文 (zh)** - китайский

Переводы находятся в `src/i18n/locales/`.

## 📊 Модель данных

### Task (Задача)
```typescript
interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  tags?: string[]
}
```

### TaskStatus (Статус задачи)
- `TODO` - к выполнению
- `IN_PROGRESS` - в работе
- `REVIEW` - на проверке
- `DONE` - готово

### TaskPriority (Приоритет)
- `LOW` - низкий
- `MEDIUM` - средний
- `HIGH` - высокий
- `URGENT` - срочный

## 🔧 Основные команды

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Запуск тестов
npm run test:unit

# Запуск тестов в watch mode
npm run test:unit -- --watch

# Линтинг
npm run lint

# Форматирование кода
npm run format

# Проверка типов
npm run type-check
```

## 🧪 Тестирование

Проект использует **Vitest** для unit-тестирования и **@vue/test-utils** для тестирования компонентов.

Структура тестов:
```
src/
├── components/
│   └── __tests__/
├── composables/
│   └── __tests__/
└── stores/
    └── __tests__/
```

Пример запуска тестов:
```bash
# Все тесты
npm run test:unit

# В watch mode (для разработки)
npm run test:unit -- --watch

# С coverage
npm run test:unit -- --coverage
```

## 🎯 Основные концепции

### Composables
Переиспользуемая логика вынесена в composables:
- `useTheme()` - переключение тем, сохранение в localStorage
- `useLocale()` - переключение языка, сохранение в localStorage
- `useTasks()` - фильтрация, сортировка, статистика задач

### Stores (Pinia)
Глобальное состояние управляется через Pinia:
- `useTasksStore()` - задачи, CRUD операции
- `useThemeStore()` - текущая тема
- `useLocaleStore()` - текущий язык

### Компоненты
Все UI компоненты разбиты на категории:
- **common** - переиспользуемые UI элементы
- **feature-specific** - компоненты конкретных фичей

## 📝 Соглашения по коду

1. **Именование файлов:**
   - Компоненты: `PascalCase.vue` (например, `TaskCard.vue`)
   - Composables: `camelCase.ts` с префиксом `use` (например, `useTheme.ts`)
   - Stores: `camelCase.ts` (например, `tasks.ts`)

2. **Структура компонента:**
   ```vue
   <script setup lang="ts">
   // Импорты
   // Composables
   // Reactive состояние
   // Computed свойства
   // Методы
   </script>

   <template>
     <!-- Шаблон -->
   </template>

   <style scoped>
   /* Стили */
   </style>
   ```

3. **TypeScript:**
   - Всегда указывать типы для props и emits
   - Использовать интерфейсы из `src/types/`
   - Избегать `any`, использовать `unknown` если тип неизвестен

4. **CSS:**
   - Использовать scoped стили
   - CSS переменные для тем
   - BEM методология для классов

## 🚀 Добавление новых фич

### Добавление нового компонента
1. Создать файл в соответствующей директории `components/`
2. Экспортировать из `index.ts` если нужно
3. Создать тест в `__tests__/`

### Добавление новой темы
1. Добавить enum в `src/types/app.ts`
2. Создать CSS файл в `src/assets/themes/`
3. Обновить `useTheme` composable

### Добавление нового языка
1. Добавить enum в `src/types/app.ts`
2. Создать файл перевода в `src/i18n/locales/`
3. Импортировать в `src/i18n/index.ts`

## 🐛 Отладка

- Vue DevTools - для отладки компонентов и stores
- Browser DevTools - для отладки JS/CSS
- Vite DevTools - встроен в проект

## 📚 Полезные ссылки

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vue I18n Documentation](https://vue-i18n.intlify.dev/)
- [FullCalendar Vue](https://fullcalendar.io/docs/vue)
- [Vitest Documentation](https://vitest.dev/)
- [VueUse Documentation](https://vueuse.org/)

## 💡 Советы для работы с Claude

1. **Контекст:** При обращении к Claude упоминайте конкретные файлы или компоненты
2. **Тестирование:** Просите создавать тесты для новых компонентов
3. **Типы:** Всегда просите типизировать код
4. **Документация:** Просите обновлять этот файл при добавлении новых фич

## 🔄 История изменений

### 2024-01-XX - Начальная версия
- Создана базовая структура проекта
- Настроена локализация (en, ru, zh)
- Настроена система тем (light, dark)
- Созданы основные типы
- Созданы 4 основные страницы
