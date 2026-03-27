<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '@/types'
import { TaskStatus, TaskPriority } from '@/types'
import { useI18n } from 'vue-i18n'

interface Props {
  task?: Task
  modalId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: [result: Task]
  dismiss: [reason?: string]
}>()

const { t } = useI18n()

// Form data
const form = ref({
  title: props.task?.title || '',
  description: props.task?.description || '',
  status: props.task?.status || TaskStatus.TODO,
  priority: props.task?.priority || TaskPriority.MEDIUM,
  dueDate: props.task?.dueDate ? formatDateForInput(props.task.dueDate) : '',
  tags: props.task?.tags?.join(', ') || '',
})

function formatDateForInput(date: Date): string {
  return new Date(date).toISOString().split('T')[0]
}

function handleSubmit() {
  const result: Task = {
    id: props.task?.id || Date.now().toString(),
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
    createdAt: props.task?.createdAt || new Date(),
    updatedAt: new Date(),
  }

  emit('close', result)
}

function handleCancel() {
  emit('dismiss', 'cancel')
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
        <input id="dueDate" v-model="form.dueDate" type="date" class="form-input" />
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

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="handleCancel">
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn btn-primary">
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.btn {
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
