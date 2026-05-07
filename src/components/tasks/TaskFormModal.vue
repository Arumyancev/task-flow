<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { TaskStatus, TaskPriority } from '@/types'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/common/AppIcon.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useModal } from '@/composables/useModal'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'

interface Props {
  task?: Task
  modalId: string
}

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

const originalDismiss = async (reason?: string) => {
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
        emit('dismiss', reason)
      }
    } catch (error) {
      // Подтверждение отменено, ничего не делаем
    }
  } else {
    emit('dismiss', reason)
  }
}

defineExpose({
  handleDismiss: originalDismiss,
})

const form = ref({
  title: props.task?.title || '',
  description: props.task?.description || '',
  status: props.task?.status || TaskStatus.TODO,
  priority: props.task?.priority || TaskPriority.MEDIUM,
  dueDate: props.task?.dueDate ? new Date(props.task.dueDate) : null as Date | null,
  tags: props.task?.tags?.join(', ') || '',
})

const initialForm = {
  title: props.task?.title || '',
  description: props.task?.description || '',
  status: props.task?.status || TaskStatus.TODO,
  priority: props.task?.priority || TaskPriority.MEDIUM,
  dueDate: props.task?.dueDate ? new Date(props.task.dueDate) : null as Date | null,
  tags: props.task?.tags?.join(', ') || '',
}

const isDirty = computed(() => {
  return (
    form.value.title !== initialForm.title ||
    form.value.description !== initialForm.description ||
    form.value.status !== initialForm.status ||
    form.value.priority !== initialForm.priority ||
    form.value.dueDate?.getTime() !== initialForm.dueDate?.getTime() ||
    form.value.tags !== initialForm.tags
  )
})

const statusOptions = computed(() => [
  { label: t('status.todo'), value: TaskStatus.TODO },
  { label: t('status.in_progress'), value: TaskStatus.IN_PROGRESS },
  { label: t('status.review'), value: TaskStatus.REVIEW },
  { label: t('status.done'), value: TaskStatus.DONE },
])

const priorityOptions = computed(() => [
  { label: t('priority.low'), value: TaskPriority.LOW },
  { label: t('priority.medium'), value: TaskPriority.MEDIUM },
  { label: t('priority.high'), value: TaskPriority.HIGH },
  { label: t('priority.urgent'), value: TaskPriority.URGENT },
])

function handleSubmit() {
  const result: TaskFormResult = {
    id: props.task?.id,
    title: form.value.title,
    description: form.value.description,
    status: form.value.status,
    priority: form.value.priority,
    dueDate: form.value.dueDate || undefined,
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
    } catch (error) {
      // Подтверждение отменено, ничего не делаем
    }
  } else {
    emit('dismiss', 'cancel')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-group">
      <label for="title" class="form-label">
        {{ t('task.title') }} <span class="required">*</span>
      </label>
      <InputText
        id="title"
        v-model="form.title"
        :placeholder="t('task.title')"
        fluid
        required
      />
    </div>

    <div class="form-group">
      <label for="description" class="form-label">{{ t('task.description') }}</label>
      <Textarea
        id="description"
        v-model="form.description"
        :placeholder="t('task.description')"
        rows="4"
        fluid
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="status" class="form-label">{{ t('task.status') }}</label>
        <Select
          id="status"
          v-model="form.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          fluid
        />
      </div>

      <div class="form-group">
        <label for="priority" class="form-label">{{ t('task.priority') }}</label>
        <Select
          id="priority"
          v-model="form.priority"
          :options="priorityOptions"
          optionLabel="label"
          optionValue="value"
          fluid
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="dueDate" class="form-label">{{ t('task.dueDate') }}</label>
        <DatePicker
          id="dueDate"
          v-model="form.dueDate"
          showIcon
          fluid
        />
      </div>

      <div class="form-group">
        <label for="tags" class="form-label">{{ t('task.tags') }}</label>
        <InputText
          id="tags"
          v-model="form.tags"
          placeholder="frontend, bug, urgent"
          fluid
        />
      </div>
    </div>

    <div class="form-actions">
      <Button
        type="button"
        :label="t('common.cancel')"
        icon="pi pi-times"
        severity="secondary"
        @click="handleCancel"
      />
      <Button
        type="submit"
        :label="task ? t('common.save') : t('common.create')"
        :icon="task ? 'pi pi-save' : 'pi pi-plus'"
        severity="success"
      />
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
