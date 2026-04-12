<script setup lang="ts">
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { TaskStatus } from '@/types'
import type { Task } from '@/types'
import { storeToRefs } from 'pinia'
import TaskCard from '@/components/common/TaskCard.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/composables/useModal'
import draggable from 'vuedraggable'

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const { t } = useI18n()
const modal = useModal()

const columns = [
  { status: TaskStatus.TODO, title: t('status.todo'), icon: 'ListTodo' },
  { status: TaskStatus.IN_PROGRESS, title: t('status.in_progress'), icon: 'Rocket' },
  { status: TaskStatus.REVIEW, title: t('status.review'), icon: 'Eye' },
  { status: TaskStatus.DONE, title: t('status.done'), icon: 'CheckCircle2' },
]

const columnTasks = computed(() => ({
  [TaskStatus.TODO]: tasks.value.filter((t) => t.status === TaskStatus.TODO),
  [TaskStatus.IN_PROGRESS]: tasks.value.filter((t) => t.status === TaskStatus.IN_PROGRESS),
  [TaskStatus.REVIEW]: tasks.value.filter((t) => t.status === TaskStatus.REVIEW),
  [TaskStatus.DONE]: tasks.value.filter((t) => t.status === TaskStatus.DONE),
}))

function handleDragChange(status: TaskStatus, evt: any) {
  if (evt.added) {
    const task = evt.added.element as Task
    tasksStore.updateTaskStatus(task.id, status)
  }
}

async function openEditTaskModal(task: Task) {
  try {
    const result = await modal.open<Task>(
      TaskFormModal,
      { task },
      { title: t('task.editTask'), size: 'md' },
    )
    tasksStore.updateTask(task.id, result)
  } catch (error) {
    // Modal dismissed
  }
}

async function handleDeleteTask(task: Task) {
  try {
    const confirmed = await modal.open<boolean>(
      ConfirmDialog,
      {
        message: t('task.deleteConfirm'),
        title: t('task.deleteTask'),
        confirmText: t('common.delete'),
        danger: true,
      },
      { size: 'sm' },
    )
    if (confirmed) {
      tasksStore.deleteTask(task.id)
    }
  } catch (error) {
    // Modal dismissed
  }
}
</script>

<template>
  <div class="kanban">
    <div class="kanban-board">
      <div v-for="column in columns" :key="column.status" class="kanban-column">
        <div class="column-header">
          <div class="column-icon">
            <AppIcon :name="column.icon" :size="20" />
          </div>
          <h3 class="column-title">{{ column.title }}</h3>
          <span class="column-count">{{ columnTasks[column.status].length }}</span>
        </div>
        <div class="column-content">
          <draggable
            :list="columnTasks[column.status]"
            :group="{ name: 'tasks', pull: true, put: true }"
            class="drag-area"
            item-key="id"
            @change="(evt: any) => handleDragChange(column.status, evt)"
          >
            <template #item="{ element: task }">
              <TaskCard
                :task="task"
                @click="openEditTaskModal(task)"
                @delete="handleDeleteTask(task)"
              />
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban {
  width: 100%;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.kanban-column {
  background-color: var(--color-background-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.column-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-border);
}

.column-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.column-title {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  flex: 1;
}

.column-count {
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  font-weight: 600;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
  min-height: 0;
}

.drag-area {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
  min-height: 100px;
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.drag-area:empty {
  background-color: var(--color-surface);
  border: 2px dashed var(--color-border);
}

.drag-area :deep(.sortable-ghost) {
  opacity: 0.4;
}

.drag-area :deep(.sortable-drag) {
  cursor: move;
}

.drag-area :deep(.sortable-chosen) {
  cursor: move;
}
</style>
