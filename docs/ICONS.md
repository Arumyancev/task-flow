# 🎨 Система иконок

## Библиотека иконок

Проект использует **Lucide Vue Next** - форк Feather Icons с широким набором SVG иконок.

- 🎯 **1000+ иконок** - огромный выбор
- 📦 **Tree-shakeable** - только используемые иконки попадают в бандл
- 🎨 **Полностью кастомизируемые** - цвет, размер, толщина линий
- ♿ **Доступные** - правильные aria-атрибуты
- 🔧 **TypeScript** - полная типизация

## Использование

### Компонент AppIcon

Создан переиспользуемый компонент `AppIcon` для единообразного использования иконок:

```vue
<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
</script>

<template>
  <!-- Базовое использование -->
  <AppIcon name="Heart" />
  
  <!-- С размером -->
  <AppIcon name="Star" :size="32" />
  
  <!-- С кастомной толщиной линий -->
  <AppIcon name="Sun" :size="24" :stroke-width="1.5" />
  
  <!-- С кастомным цветом -->
  <AppIcon name="Moon" :size="20" color="#42b883" />
  
  <!-- С CSS классом -->
  <AppIcon name="Search" class="my-icon" />
</template>

<style scoped>
.my-icon {
  color: var(--color-primary);
}
</style>
```

### Props компонента AppIcon

| Prop | Тип | Значение по умолчанию | Описание |
|------|-----|----------------------|----------|
| `name` | `string` | *обязательный* | Название иконки из Lucide |
| `size` | `number \| string` | `24` | Размер иконки в пикселях |
| `strokeWidth` | `number` | `2` | Толщина линий (1-3) |
| `color` | `string` | наследуется | CSS цвет |
| `class` | `string` | - | CSS класс |

## Популярные иконки в проекте

### Навигация
```vue
<AppIcon name="Home" />
<AppIcon name="LayoutDashboard" />
<AppIcon name="ListTodo" />
<AppIcon name="Calendar" />
<AppIcon name="Settings" />
<AppIcon name="Menu" />
```

### Действия
```vue
<AppIcon name="Plus" />        <!-- Добавить -->
<AppIcon name="Edit" />         <!-- Редактировать -->
<AppIcon name="Trash2" />       <!-- Удалить -->
<AppIcon name="Save" />         <!-- Сохранить -->
<AppIcon name="X" />            <!-- Закрыть -->
<AppIcon name="Check" />        <!-- Подтвердить -->
<AppIcon name="Search" />       <!-- Поиск -->
<AppIcon name="Filter" />       <!-- Фильтр -->
```

### Статусы задач
```vue
<AppIcon name="ListTodo" />     <!-- TODO -->
<AppIcon name="Rocket" />       <!-- In Progress -->
<AppIcon name="Eye" />          <!-- Review -->
<AppIcon name="CheckCircle2" /> <!-- Done -->
```

### Приоритеты
```vue
<AppIcon name="ArrowDown" />    <!-- Low -->
<AppIcon name="Minus" />        <!-- Medium -->
<AppIcon name="ArrowUp" />      <!-- High -->
<AppIcon name="AlertTriangle" /><!-- Urgent -->
```

### Темы
```vue
<AppIcon name="Sun" />          <!-- Light theme -->
<AppIcon name="Moon" />         <!-- Dark theme -->
```

### Другие
```vue
<AppIcon name="BarChart3" />    <!-- Статистика -->
<AppIcon name="Bell" />         <!-- Уведомления -->
<AppIcon name="User" />         <!-- Пользователь -->
<AppIcon name="Mail" />         <!-- Email -->
<AppIcon name="Clock" />        <!-- Время -->
<AppIcon name="Tag" />          <!-- Тег -->
```

## Поиск иконок

Все доступные иконки можно найти на официальном сайте:
👉 [https://lucide.dev/icons/](https://lucide.dev/icons/)

Или в документации пакета:
👉 [https://github.com/lucide-icons/lucide](https://github.com/lucide-icons/lucide)

## Примеры использования в проекте

### В кнопках
```vue
<button class="btn-primary">
  <AppIcon name="Plus" :size="20" />
  Add Task
</button>
```

### В навигации
```vue
<nav>
  <RouterLink to="/">
    <AppIcon name="Home" :size="20" />
    Dashboard
  </RouterLink>
</nav>
```

### В карточках
```vue
<div class="card-header">
  <AppIcon name="BarChart3" :size="24" />
  <h3>Statistics</h3>
</div>
```

### В пустых состояниях
```vue
<div class="empty-state">
  <AppIcon name="Search" :size="64" stroke-width="1.5" />
  <p>No results found</p>
</div>
```

## Стилизация

### Наследование цвета
Иконки по умолчанию наследуют цвет текста:

```vue
<div style="color: red;">
  <AppIcon name="Heart" /> <!-- Будет красной -->
</div>
```

### CSS классы
```vue
<template>
  <AppIcon name="Star" class="star-icon" />
</template>

<style scoped>
.star-icon {
  color: gold;
  cursor: pointer;
  transition: transform 0.2s;
}

.star-icon:hover {
  transform: scale(1.2);
}
</style>
```

### CSS переменные
```vue
<AppIcon name="Sun" :style="{ color: 'var(--color-primary)' }" />
```

## Best Practices

### ✅ Правильно

```vue
<!-- Используйте семантические размеры -->
<AppIcon name="Plus" :size="20" /> <!-- Для кнопок -->
<AppIcon name="Calendar" :size="24" /> <!-- Для заголовков -->
<AppIcon name="Search" :size="64" /> <!-- Для пустых состояний -->

<!-- Настраивайте толщину линий -->
<AppIcon name="Sun" :stroke-width="1.5" /> <!-- Легкие иконки -->
<AppIcon name="AlertTriangle" :stroke-width="2.5" /> <!-- Акцентные -->

<!-- Используйте цвета через CSS -->
<AppIcon name="Heart" class="primary-icon" />
```

### ❌ Неправильно

```vue
<!-- Не используйте emoji вместо иконок -->
<span>📊</span> <!-- ❌ -->
<AppIcon name="BarChart3" /> <!-- ✅ -->

<!-- Не хардкодьте цвета -->
<AppIcon name="Star" color="#ffcc00" /> <!-- ❌ -->
<AppIcon name="Star" :style="{ color: 'var(--color-warning)' }" /> <!-- ✅ -->

<!-- Не используйте слишком маленькие размеры -->
<AppIcon name="X" :size="12" /> <!-- ❌ Плохо для доступности -->
<AppIcon name="X" :size="16" /> <!-- ✅ Минимум 16px -->
```

## Производительность

### Tree-shaking
Lucide автоматически исключает неиспользуемые иконки из финального бандла благодаря динамическому импорту в `AppIcon`:

```typescript
const IconComponent = computed(() => {
  return defineAsyncComponent(() =>
    import('lucide-vue-next').then((module) => {
      return module[iconName] || module.HelpCircle
    })
  )
})
```

### Кэширование
Vue автоматически кэширует компоненты иконок после первой загрузки.

## Миграция с emoji

Если в проекте использовались emoji, замените их на иконки:

| Emoji | Иконка | Код |
|-------|--------|-----|
| 📊 | BarChart3 | `<AppIcon name="BarChart3" />` |
| ✅ | CheckCircle2 | `<AppIcon name="CheckCircle2" />` |
| 🚀 | Rocket | `<AppIcon name="Rocket" />` |
| 📝 | ListTodo | `<AppIcon name="ListTodo" />` |
| 👀 | Eye | `<AppIcon name="Eye" />` |
| 📅 | Calendar | `<AppIcon name="Calendar" />` |
| 🔍 | Search | `<AppIcon name="Search" />` |
| 🌙 | Moon | `<AppIcon name="Moon" />` |
| ☀️ | Sun | `<AppIcon name="Sun" />` |

## Доступность

Иконки автоматически получают правильные `aria` атрибуты от Lucide. Для интерактивных элементов добавляйте текст или `aria-label`:

```vue
<!-- С текстом (предпочтительно) -->
<button>
  <AppIcon name="Plus" />
  Add Task
</button>

<!-- Только иконка -->
<button aria-label="Add task">
  <AppIcon name="Plus" />
</button>
```
