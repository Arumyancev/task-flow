<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import { TaskStatus } from '@/types'
import { storeToRefs } from 'pinia'
import TaskCard from '@/components/common/TaskCard.vue'
import { useI18n } from 'vue-i18n'

const tasksStore = useTasksStore()
const { getTasksByStatus } = tasksStore
const { t } = useI18n()

const columns = [
  { status: TaskStatus.TODO, title: t('status.todo'), icon: '📝' },
  { status: TaskStatus.IN_PROGRESS, title: t('status.in_progress'), icon: '🚀' },
  { status: TaskStatus.REVIEW, title: t('status.review'), icon: '👀' },
  { status: TaskStatus.DONE, title: t('status.done'), icon: '✅' },
]
</script>

<template>
  <div class="kanban">
    <div class="kanban-header">
      <h1>{{ t('nav.kanban') }}</h1>
      <p class="subtitle">Drag & Drop Task Management</p>
    </div>

    <div class="kanban-board">
      <div v-for="column in columns" :key="column.status" class="kanban-column">
        <div class="column-header">
          <span class="column-icon">{{ column.icon }}</span>
          <h3 class="column-title">{{ column.title }}</h3>
          <span class="column-count">{{ getTasksByStatus(column.status).length }}</span>
        </div>
        <div class="column-content">
          <TaskCard
            v-for="task in getTasksByStatus(column.status)"
            :key="task.id"
            :task="task"
          />
          <div v-if="getTasksByStatus(column.status).length === 0" class="empty-column">
            {{ t('common.noData') }}
          </div>
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
  font-size: var(--font-xl);
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
</style>
