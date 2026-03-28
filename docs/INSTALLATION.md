# 📦 Установка зависимостей

После клонирования проекта или добавления новых зависимостей выполните:

```bash
npm install
```

## Новые зависимости

### vuedraggable (v4.1.0)
Библиотека для drag & drop функциональности в Kanban доске.

- **Официальная библиотека** для Vue 3
- **Легковесная** - основана на Sortable.js
- **TypeScript** поддержка

### Использование в проекте:
- **Kanban доска** - перетаскивание задач между колонками

## Если возникают проблемы

### Проблема: "Module not found"
```bash
# Удалите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install
```

### Проблема: TypeScript ошибки с vuedraggable
```bash
# Установите типы (если нужно)
npm install --save-dev @types/sortablejs
```

## Список всех зависимостей

### Production:
- `vue` - Vue 3 фреймворк
- `vue-router` - Роутинг
- `pinia` - State management
- `vue-i18n` - Интернационализация
- `lucide-vue-next` - SVG иконки
- `vuedraggable` - Drag & drop

### Development:
- `vite` - Сборщик
- `vitest` - Тестирование
- `typescript` - Типизация
- `eslint` - Линтер
- И другие...

Полный список в `package.json`
