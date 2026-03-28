<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import { TaskStatus } from '@/types'
import type { Task } from '@/types'
import { storeToRefs } from 'pinia'
import TaskCard from '@/components/common/TaskCard.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/composables/useModal'

const tasksStore = useTasksStore()
const { getTasksByStatus } = tasksStore
const { t } = useI18n()
const modal = useModal()

const columns = [
  { status: TaskStatus.TODO, title: t('status.todo'), icon: 'ListTodo' },
  { status: TaskStatus.IN_PROGRESS, title: t('status.in_progress'), icon: 'Rocket' },
  { status: TaskStatus.REVIEW, title: t('status.review'), icon: 'Eye' },
  { status: TaskStatus.DONE, title: t('status.done'), icon: 'CheckCircle2' },
]

async function openAddTaskModal(defaultStatus?: TaskStatus) {
  try {
    const result = await modal.open<Task>(
      TaskFormModal,
      defaultStatus ? { task: { status: defaultStatus } as Partial<Task> } : {},
      { title: t('task.addTask'), size: 'md' },
    )
    tasksStore.addTask(result)
  } catch (error) {
    // Modal dismissed
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
</script>

<template>
  <div class="kanban">
    <div class="kanban-header">
      <div>
        <h1>{{ t('nav.kanban') }}</h1>
        <p class="subtitle">Drag & Drop Task Management</p>
      </div>
      <button class="btn-add" @click="openAddTaskModal()">
        <AppIcon name="Plus" :size="20" />
        {{ t('task.addTask') }}
      </button>
    </div>

    <div class="kanban-board">
      <div v-for="column in columns" :key="column.status" class="kanban-column">
        <div class="column-header">
          <div class="column-icon">
            <AppIcon :name="column.icon" :size="20" />
          </div>
          <h3 class="column-title">{{ column.title }}</h3>
          <span class="column-count">{{ getTasksByStatus(column.status).length }}</span>
        </div>
        <div class="column-content">
          <TaskCard
            v-for="task in getTasksByStatus(column.status)"
            :key="task.id"
            :task="task"
            @click="openEditTaskModal(task)"
          />
          <button class="add-task-btn" @click="openAddTaskModal(column.status)">
            <AppIcon name="Plus" :size="16" />
            {{ t('task.addTask') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban {
  width: 100%;
}

.kanban-header {
  margin-bottom: var(--spacing-2xl);
}

.kanban-header h1 {
  font-size: var(--font-4xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
}

.subtitle {
  font-size: var(--font-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  align-items: start;
}

.kanban-column {
  background-color: var(--color-background-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  min-height: 400px;
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
}

.empty-column {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
  font-size: var(--font-sm);
}

.kanban-header {
  margin-bottom: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.kanban-header h1 {
  font-size: var(--font-4xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
}

.subtitle {
  font-size: var(--font-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-md);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-add:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.add-task-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;
  padding: var(--spacing-sm);
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-task-btn:hover {
  background-color: var(--color-background-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
