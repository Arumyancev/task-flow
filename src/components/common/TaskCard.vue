<script setup lang="ts">
import type { Task } from '@/types'
import { TaskPriority, TaskStatus } from '@/types'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/common/AppIcon.vue'

interface Props {
  task: Task
}

defineProps<Props>()

const emit = defineEmits<{
  click: [task: Task]
  delete: [task: Task]
  statusChange: [task: Task, status: TaskStatus]
}>()

const { t } = useI18n()

const priorityColors = {
  [TaskPriority.LOW]: 'var(--color-info)',
  [TaskPriority.MEDIUM]: 'var(--color-warning)',
  [TaskPriority.HIGH]: 'var(--color-danger)',
  [TaskPriority.URGENT]: 'var(--color-danger)',
}

function formatDate(date?: Date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="task-card" @click="emit('click', task)">
    <div class="task-header">
      <h4 class="task-title">{{ task.title }}</h4>
      <div class="task-actions">
        <span
          class="task-priority"
          :style="{ backgroundColor: priorityColors[task.priority] }"
          :title="t(`priority.${task.priority}`)"
        ></span>
        <button
          class="delete-btn"
          @click.stop="emit('delete', task)"
          :title="t('task.deleteTask')"
        >
          <AppIcon name="Trash2" :size="16" />
        </button>
      </div>
    </div>
    <p v-if="task.description" class="task-description">{{ task.description }}</p>
    <div class="task-footer">
      <div v-if="task.tags && task.tags.length" class="task-tags">
        <span v-for="tag in task.tags" :key="tag" class="task-tag">{{ tag }}</span>
      </div>
      <div v-if="task.dueDate" class="task-due">
        📅 {{ formatDate(task.dueDate) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.task-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.task-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.task-title {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  flex: 1;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.task-priority {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.delete-btn {
  display: none;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.delete-btn:hover {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.task-card:hover .delete-btn {
  display: flex;
}

.task-description {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.task-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.task-tag {
  font-size: var(--font-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-background-soft);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
}

.task-due {
  font-size: var(--font-xs);
  color: var(--color-text-muted);
}
</style>
