# Работа с модальными окнами во Vue

## 📚 Система модальных окон

В проекте реализована система модальных окон, похожая на сервис в Angular. Она основана на:
- **Pinia Store** (`useModalStore`) - хранилище состояния модалок
- **Composable** (`useModal`) - API для работы с модалками (аналог Angular сервиса)
- **Teleport** - встроенная директива Vue 3 для рендера модалок вне иерархии компонентов
- **Promise-based API** - модалки возвращают Promise с результатом

## 🎯 Основные концепции

### 1. Открытие модалки
```typescript
const modal = useModal()

// Простое открытие
await modal.open(MyModalComponent)

// С пропсами
await modal.open(MyModalComponent, { userId: '123' })

// С опциями
await modal.open(MyModalComponent, { userId: '123' }, {
  title: 'Edit User',
  size: 'lg',
  closable: true,
  persistent: false
})
```

### 2. Получение результата
```typescript
try {
  // Модалка возвращает результат через emit('close', result)
  const result = await modal.open<Task>(TaskFormModal, { task })
  console.log('Result:', result)
} catch (error) {
  // Модалка была закрыта без результата (ESC, backdrop click, dismiss)
  console.log('Modal dismissed:', error)
}
```

## 🔄 Сравнение с Angular

| Angular | Vue 3 (наш подход) |
|---------|-------------------|
| `dialog.open(Component)` | `modal.open(Component)` |
| `dialogRef.afterClosed()` | `await modal.open()` |
| `dialogRef.close(result)` | `emit('close', result)` |
| `@Inject(MAT_DIALOG_DATA)` | `defineProps<Props>()` |
| Dialog Module | Встроенный Teleport |

Полная документация в `CLAUDE.md`
