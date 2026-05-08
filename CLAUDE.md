# Task Flow - Контекст проекта для Claude

> **⚠️ Важно:** Все изменения вносятся в основной репозиторий `D:\vue\task-flow`.

## 📋 Описание проекта

Task Flow — современное приложение для управления задачами на **Vue 3 + TypeScript**. Проект создан для изучения Vue.js и включает основные концепции фреймворка.

## 🎯 Основные возможности

1. **Dashboard** (`/`) — дашборд с виджетами: статистика задач, дата/время, погода
2. **Kanban** (`/tasks/kanban`) — канбан-доска с drag & drop (VueDraggable)
3. **Calendar** (`/tasks/calendar`) — календарь задач на базе FullCalendar
4. **List** (`/tasks/list`) — список всех задач с фильтрацией (поиск, статус, приоритет)

## 🏗️ Архитектура проекта

```
src/
├── assets/              # Глобальные стили (CSS-переменные, темы)
│   ├── base.css         # Базовые стили и CSS-переменные
│   ├── main.css         # Основные стили приложения
│   └── logo.svg         # Логотип
├── components/          # Переиспользуемые компоненты
│   ├── common/          # UI-kit: AppCard, AppIcon, ConfirmDialog, ModalContainer, TaskCard
│   ├── dashboard/       # DateTimeWidget, TaskStats, WeatherWidget
│   └── tasks/           # TaskFormModal
├── composables/         # Vue Composables (переиспользуемая логика)
│   ├── useTheme.ts      # Управление темами (Light/Dark)
│   ├── useLocale.ts     # Управление локализацией
│   └── useModal.ts      # Promise-based модальные окна
├── i18n/                # Интернационализация
│   ├── index.ts         # Конфигурация i18n
│   └── locales/         # Переводы: en.ts, ru.ts, zh.ts
├── layouts/             # Layout компоненты
│   └── MainLayout.vue   # Основной layout с навигацией
├── router/              # Vue Router
│   ├── index.ts         # Конфигурация маршрутов
│   └── __tests__/       # Тесты роутера (20 тестов)
├── stores/              # Pinia хранилища
│   ├── tasks.ts         # Store для задач (CRUD + localStorage)
│   ├── theme.ts         # Store для темы (Light/Dark + localStorage)
│   ├── locale.ts        # Store для локали (EN/RU/ZH + localStorage)
│   └── modal.ts         # Store для системы модальных окон
├── types/               # TypeScript типы
│   ├── task.ts          # Task, TaskStatus, TaskPriority, TaskStats
│   └── app.ts           # Theme, Locale
├── views/               # Страницы приложения
│   ├── DashboardView.vue
│   └── tasks/
│       ├── TasksLayout.vue    # Layout раздела задач (табы/навигация)
│       ├── KanbanView.vue     # Канбан-доска
│       ├── CalendarView.vue   # FullCalendar
│       └── ListView.vue       # Таблица с фильтрацией
├── App.vue              # Корневой компонент
└── main.ts              # Точка входа (Vue, Pinia, Router, i18n, PrimeVue)
```

## 🎨 Технологический стек

- **Vue 3** — прогрессивный JavaScript фреймворк
- **TypeScript** — типизированный JavaScript
- **Vite** — быстрый сборщик
- **Pinia** — state management (4 stores: tasks, theme, locale, modal)
- **Vue Router** — роутинг (4 маршрута + редиректы)
- **Vue I18n** — интернационализация (en, ru, zh)
- **PrimeVue 4** — UI-библиотека (InputText, Select, IconField, и др.)
- **FullCalendar** — календарь задач
- **Lucide Vue Next** — SVG иконки (через `AppIcon`, tree-shaking)
- **VueDraggable** — drag & drop для Kanban
- **Vitest + @vue/test-utils** — тестирование (33 теста)

## 🎨 Темы

Приложение поддерживает 2 темы через CSS-переменные:

- **Light** — светлая тема
- **Dark** — тёмная тема (класс `dark-mode` на `html`)

Темы реализованы через CSS-переменные в `src/assets/base.css` и переключаются через Pinia store + composable `useTheme()`.

## 🌍 Локализация

Поддерживаемые языки:
- **English (en)** — английский
- **Русский (ru)** — русский
- **中文 (zh)** — китайский

Переводы находятся в `src/i18n/locales/`. Переключение через `useLocale()` composable.

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
- `TODO` — к выполнению
- `IN_PROGRESS` — в работе
- `REVIEW` — на проверке
- `DONE` — готово

### TaskPriority (Приоритет)
- `LOW` — низкий
- `MEDIUM` — средний
- `HIGH` — высокий
- `URGENT` — срочный

## 🔧 Основные команды

```bash
npm install          # Установка зависимостей
npm run dev          # Запуск dev-сервера
npm run build        # Сборка для production
npm run test:unit    # Запуск всех тестов
npm run lint         # Линтинг
npm run format       # Форматирование кода
npm run type-check   # Проверка типов
```

## 🧪 Тестирование

Проект использует **Vitest** + **@vue/test-utils** (33 теста).

Структура тестов:
```
src/
├── components/__tests__/   # AppCard.spec.ts (6 тестов)
├── router/__tests__/       # index.spec.ts (20 тестов)
└── stores/__tests__/       # tasks.spec.ts (7 тестов)
```

Примеры запуска:
```bash
npm run test:unit                 # Все тесты
npm run test:unit -- --watch      # Watch mode
npm run test:unit -- --coverage   # С отчётом покрытия
```

## 🪟 Система модальных окон

Promise-based API (аналог Angular Dialog Service):

```typescript
import { useModal } from '@/composables/useModal'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'

const modal = useModal()

// Открыть модалку и получить результат
const result = await modal.open<Task>(
  TaskFormModal,
  { task },                    // props для компонента
  { title: 'Edit Task', size: 'md' }  // опции модалки
)

// Закрыть внутри компонента: emit('close', result)
// Закрыть без результата:   emit('dismiss')
```

### Файлы системы:
- `stores/modal.ts` — Pinia store для управления модалками
- `composables/useModal.ts` — Composable (аналог сервиса)
- `components/common/ModalContainer.vue` — контейнер с Teleport
- `docs/MODAL_SYSTEM.md` — полная документация

## 📝 Соглашения по коду

1. **UI-компоненты:** Все элементы форм (input, select, button, и т.д.) — из **PrimeVue 4**. Иконки — из **Lucide** через `<AppIcon>`.
2. **Именование файлов:**
   - Компоненты: `PascalCase.vue` (например, `TaskCard.vue`)
   - Composables: `camelCase.ts` с префиксом `use` (например, `useTheme.ts`)
   - Stores: `camelCase.ts` (например, `tasks.ts`)
3. **Структура компонента:** `<script setup lang="ts">` → `<template>` → `<style scoped>`
4. **TypeScript:** Всегда типизировать props и emits. Избегать `any`. Использовать `unknown` при необходимости.
5. **CSS:** Scoped стили, CSS-переменные для тем, BEM-методология.

## 🚀 Добавление новых фич

### Добавление нового компонента
1. Создать файл в `components/` в соответствующей категории
2. Создать тест в `src/components/__tests__/` или `src/*/__tests__/`

### Добавление новой темы
1. Добавить enum в `src/types/app.ts`
2. Добавить CSS-переменные в `src/assets/base.css`
3. Обновить `useTheme` composable / theme store

### Добавление нового языка
1. Добавить enum в `src/types/app.ts`
2. Создать файл перевода в `src/i18n/locales/`
3. Импортировать в `src/i18n/index.ts`

## 🐛 Отладка

- **Vue DevTools** — для отладки компонентов и stores
- **Browser DevTools** — для JS/CSS
- **Vite DevTools** — встроен в проект (`vite-plugin-vue-devtools`)

## 📚 Полезные ссылки

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vue I18n Documentation](https://vue-i18n.intlify.dev/)
- [FullCalendar Vue](https://fullcalendar.io/docs/vue)
- [PrimeVue 4](https://primevue.org/)
- [Lucide Icons](https://lucide.dev/icons/)
- [VueDraggable](https://github.com/SortableJS/vue.draggable.next)
- [Vitest](https://vitest.dev/)
- [@vue/test-utils](https://test-utils.vuejs.org/)

## 📄 Документация в `docs/`

- `MODAL_SYSTEM.md` — документация системы модальных окон
- `ICONS.md` — руководство по работе с иконками Lucide + AppIcon
- `DRAG_AND_DROP.md` — документация drag & drop в Kanban
- `INSTALLATION.md` — инструкция по установке зависимостей

## 💡 Советы для работы с Claude

1. **Контекст:** Упоминайте конкретные файлы или компоненты
2. **Тестирование:** Просите создавать тесты для новых компонентов
3. **Типы:** Всегда просите типизировать код
4. **Документация:** Просите обновлять этот файл при добавлении новых фич
5. **Модалки:** Используйте `useModal()` для работы с модальными окнами

## 🔄 История изменений

### 2026-05-07 — Актуализация CLAUDE.md
- Исправлена архитектура проекта (удалены `useTasks`, `utils/date`, `assets/themes/`)
- Исправлены пути к вьюхам (KanbanView, TasksLayout вместо TasksView)
- Убрано упоминание `@vueuse/core` (не используется)
- Обновлены команды и структура тестов
- Добавлены: система модалок, docs/ папка, PrimeVue 4 стек
- Убрано упоминание worktrees (удалены)

### 2026-03-28 — Добавлена документация
- Созданы docs/MODAL_SYSTEM.md, ICONS.md, DRAG_AND_DROP.md, INSTALLATION.md

### 2025-01-XX — Начальная версия
- Создана базовая структура проекта
- Настроена локализация (en, ru, zh)
- Настроена система тем (light, dark)
- Созданы основные типы и страницы