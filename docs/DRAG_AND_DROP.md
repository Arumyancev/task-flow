# 🎯 Drag & Drop в Kanban

## Библиотека

Используется **VueDraggable** (v4.1.0) - официальная библиотека для Vue 3, основанная на Sortable.js.

## Как это работает

### Перетаскивание задач

1. **Наведите** курсор на задачу
2. **Зажмите** левую кнопку мыши
3. **Перетащите** задачу в нужную колонку
4. **Отпустите** кнопку мыши

Статус задачи автоматически обновится!

### Визуальные эффекты

- **Ghost effect** - полупрозрачная копия карточки при перетаскивании
- **Cursor** - курсор меняется на "move"
- **Hover** - подсветка карточки при наведении

## Технические детали

### Код в KanbanView.vue

```vue
<draggable
  :list="columnTasks[column.status]"
  :group="{ name: 'tasks', pull: true, put: true }"
  class="drag-area"
  item-key="id"
  @change="(evt) => handleDragChange(column.status, evt)"
>
  <template #item="{ element: task }">
    <TaskCard :task="task" />
  </template>
</draggable>
```

### Параметры draggable

| Параметр | Описание |
|----------|----------|
| `:list` | Массив задач для колонки (реактивный) |
| `:group` | Настройки группы для drag & drop между колонками |
| `item-key` | Уникальный ключ для каждого элемента |
| `@change` | Событие при изменении (добавление/удаление) |

### Group настройки

```javascript
{
  name: 'tasks',    // Имя группы
  pull: true,       // Можно вытаскивать
  put: true         // Можно добавлять
}
```

Все колонки имеют одну группу `'tasks'`, поэтому задачи можно перетаскивать между любыми колонками.

### Обработчик изменений

```typescript
function handleDragChange(status: TaskStatus, evt: any) {
  if (evt.added) {
    const task = evt.added.element as Task
    tasksStore.updateTaskStatus(task.id, status)
  }
}
```

При добавлении задачи в колонку (`evt.added`):
1. Получаем задачу из события
2. Обновляем её статус через store
3. Store автоматически сохраняет в localStorage

## Стилизация

### CSS классы

```css
.drag-area {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-height: 50px;
  flex: 1;
}

/* Полупрозрачность при перетаскивании */
.drag-area :deep(.sortable-ghost) {
  opacity: 0.4;
}

/* Курсор при перетаскивании */
.drag-area :deep(.sortable-drag) {
  cursor: move;
}

/* Выбранный элемент */
.drag-area :deep(.sortable-chosen) {
  cursor: move;
}
```

### TaskCard стили

```css
.task-card {
  /* ... */
  user-select: none;  /* Запрет выделения текста при drag */
}
```

## Реактивность

### Computed для задач по колонкам

```typescript
const columnTasks = computed(() => ({
  [TaskStatus.TODO]: tasks.value.filter((t) => t.status === TaskStatus.TODO),
  [TaskStatus.IN_PROGRESS]: tasks.value.filter((t) => t.status === TaskStatus.IN_PROGRESS),
  [TaskStatus.REVIEW]: tasks.value.filter((t) => t.status === TaskStatus.REVIEW),
  [TaskStatus.DONE]: tasks.value.filter((t) => t.status === TaskStatus.DONE),
}))
```

Каждая колонка имеет свой реактивный массив задач:
- При изменении `tasks` в store
- Автоматически пересчитываются `columnTasks`
- UI обновляется автоматически

## События

### Change событие

VueDraggable генерирует событие `@change` с объектом:

```typescript
{
  added: {
    element: Task,      // Добавленная задача
    newIndex: number    // Новая позиция
  },
  removed: {
    element: Task,      // Удалённая задача
    oldIndex: number    // Старая позиция
  },
  moved: {
    element: Task,      // Перемещённая задача
    newIndex: number,   // Новая позиция
    oldIndex: number    // Старая позиция
  }
}
```

Мы обрабатываем только `added` - когда задача добавляется в колонку.

## Производительность

### Оптимизации

1. **item-key="id"** - использование стабильного ключа для оптимизации рендера
2. **Computed свойства** - кэширование отфильтрованных списков
3. **Deep watch** в store - батчинг изменений перед сохранением в localStorage

### Минимальные перерисовки

Vue автоматически оптимизирует рендер благодаря:
- Virtual DOM
- Реактивной системе
- Стабильным ключам (`item-key`)

## Расширение функциональности

### Добавление сортировки внутри колонки

Можно добавить обработчик `moved` события:

```typescript
function handleDragChange(status: TaskStatus, evt: any) {
  if (evt.added) {
    const task = evt.added.element as Task
    tasksStore.updateTaskStatus(task.id, status)
  }
  
  if (evt.moved) {
    // Обработка изменения порядка внутри колонки
    // Можно добавить поле `order` в Task
  }
}
```

### Анимации

VueDraggable поддерживает Sortable.js опции:

```vue
<draggable
  :list="columnTasks[column.status]"
  :animation="200"
  :easing="'cubic-bezier(1, 0, 0, 1)'"
>
```

### Ограничения

Можно ограничить drag & drop:

```vue
<draggable
  :list="columnTasks[column.status]"
  :group="{ 
    name: 'tasks',
    pull: column.status !== TaskStatus.DONE,  // Нельзя вытащить из Done
    put: column.status !== TaskStatus.TODO    // Нельзя добавить в TODO
  }"
>
```

## Troubleshooting

### Задачи не перетаскиваются

1. Проверьте что `vuedraggable` установлен: `npm install vuedraggable`
2. Проверьте импорт: `import draggable from 'vuedraggable'`
3. Проверьте что `item-key` указан
4. Проверьте консоль на ошибки

### Статус не обновляется

1. Проверьте `@change` обработчик
2. Проверьте что `updateTaskStatus` вызывается
3. Проверьте localStorage - сохраняются ли изменения

### Визуальные баги

1. Проверьте CSS - особенно `.drag-area` стили
2. Проверьте что `user-select: none` на карточках
3. Проверьте z-index если есть overlays
