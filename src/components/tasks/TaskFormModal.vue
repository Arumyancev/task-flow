<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { TaskStatus, TaskPriority } from '@/types'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/common/AppIcon.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useModal } from '@/composables/useModal'

interface Props {
  task?: Task
  modalId: string
}

// Тип для результата - либо полная задача (при редактировании), либо данные для создания
type TaskFormResult = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string
  createdAt?: Date
  updatedAt?: Date
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: [result: TaskFormResult]
  dismiss: [reason?: string]
}>()

const { t } = useI18n()
const modal = useModal()

// Form data
const form = ref({
  title: props.task?.title || '',
  description: props.task?.description || '',
  status: props.task?.status || TaskStatus.TODO,
  priority: props.task?.priority || TaskPriority.MEDIUM,
  dueDate: props.task?.dueDate ? formatDateForInput(props.task.dueDate) : '',
  tags: props.task?.tags?.join(', ') || '',
})

// Сохраняем исходное состояние для сравнения
const initialForm = {
  title: props.task?.title || '',
  description: props.task?.description || '',
  status: props.task?.status || TaskStatus.TODO,
  priority: props.task?.priority || TaskPriority.MEDIUM,
  dueDate: props.task?.dueDate ? formatDateForInput(props.task.dueDate) : '',
  tags: props.task?.tags?.join(', ') || '',
}

// Проверка на изменения в форме (dirty data)
const isDirty = computed(() => {
  return (
    form.value.title !== initialForm.title ||
    form.value.description !== initialForm.description ||
    form.value.status !== initialForm.status ||
    form.value.priority !== initialForm.priority ||
    form.value.dueDate !== initialForm.dueDate ||
    form.value.tags !== initialForm.tags
  )
})

function formatDateForInput(date: Date): string {
  // Формат datetime-local: YYYY-MM-DDTHH:mm
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function handleSubmit() {
  const result: TaskFormResult = {
    id: props.task?.id,
    title: form.value.title,
    description: form.value.description,
    status: form.value.status,
    priority: form.value.priority,
    dueDate: form.value.dueDate ? new Date(form.value.dueDate) : undefined,
    tags: form.value.tags
      ? form.value.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    createdAt: props.task?.createdAt,
    updatedAt: new Date(),
  }

  emit('close', result)
}

async function handleCancel() {
  // Если есть несохранённые изменения, показываем подтверждение
  if (isDirty.value) {
    try {
      const confirmed = await modal.open<boolean>(
        ConfirmDialog,
        {
          message: t('task.unsavedChanges') || 'You have unsaved changes. Are you sure you want to close?',
          title: t('common.warning') || 'Warning',
          confirmText: t('task.discardChanges') || 'Discard Changes',
          cancelText: t('common.cancel'),
          danger: true,
        },
        { size: 'sm' },
      )
      if (confirmed) {
        emit('dismiss', 'cancel')
      }
      // Если не подтвердили - ничего не делаем, модалка остаётся открытой
    } catch (error) {
      // Подтверждение отменено, ничего не делаем
    }
  } else {
    // Нет изменений - просто закрываем
    emit('dismiss', 'cancel')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <!-- Title -->
    <div class="form-group">
      <label for="title" class="form-label">
        {{ t('task.title') }} <span class="required">*</span>
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        class="form-input"
        :placeholder="t('task.title')"
        required
      />
    </div>

    <!-- Description -->
    <div class="form-group">
      <label for="description" class="form-label">{{ t('task.description') }}</label>
      <textarea
        id="description"
        v-model="form.description"
        class="form-textarea"
        :placeholder="t('task.description')"
        rows="4"
      ></textarea>
    </div>

    <!-- Status & Priority -->
    <div class="form-row">
      <div class="form-group">
        <label for="status" class="form-label">{{ t('task.status') }}</label>
        <select id="status" v-model="form.status" class="form-select">
          <option :value="TaskStatus.TODO">{{ t('status.todo') }}</option>
          <option :value="TaskStatus.IN_PROGRESS">{{ t('status.in_progress') }}</option>
          <option :value="TaskStatus.REVIEW">{{ t('status.review') }}</option>
          <option :value="TaskStatus.DONE">{{ t('status.done') }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="priority" class="form-label">{{ t('task.priority') }}</label>
        <select id="priority" v-model="form.priority" class="form-select">
          <option :value="TaskPriority.LOW">{{ t('priority.low') }}</option>
          <option :value="TaskPriority.MEDIUM">{{ t('priority.medium') }}</option>
          <option :value="TaskPriority.HIGH">{{ t('priority.high') }}</option>
          <option :value="TaskPriority.URGENT">{{ t('priority.urgent') }}</option>
        </select>
      </div>
    </div>

    <!-- Due Date & Tags -->
    <div class="form-row">
      <div class="form-group">
        <label for="dueDate" class="form-label">{{ t('task.dueDate') }}</label>
        <input id="dueDate" v-model="form.dueDate" type="datetime-local" class="form-input" />
      </div>

      <div class="form-group">
        <label for="tags" class="form-label">{{ t('task.tags') }}</label>
        <input
          id="tags"
          v-model="form.tags"
          type="text"
          class="form-input"
          placeholder="frontend, bug, urgent"
        />
      </div>
    </div>

    <!-- Dirty indicator -->
    <div v-if="isDirty" class="dirty-indicator">
      <AppIcon name="AlertCircle" :size="16" />
      <span>{{ t('task.unsavedChangesIndicator') || 'Unsaved changes' }}</span>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="handleCancel">
        <AppIcon name="X" :size="18" />
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn btn-primary">
        <AppIcon :name="task ? 'Save' : 'Plus'" :size="18" />
        {{ task ? t('common.save') : t('common.create') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.form-label {
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.required {
  color: var(--color-danger);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-md);
  font-family: inherit;
  transition: all var(--transition-fast);
}

.form-select {
  padding-right: var(--spacing-xl);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-sm) center;
  appearance: none;
  cursor: pointer;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.dirty-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-md);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
