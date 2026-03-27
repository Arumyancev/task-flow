<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import AppCard from '@/components/common/AppCard.vue'
import TaskStats from '@/components/dashboard/TaskStats.vue'
import TaskCard from '@/components/common/TaskCard.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/composables/useModal'
import type { Task } from '@/types'

const tasksStore = useTasksStore()
const { stats, tasks } = storeToRefs(tasksStore)
const { t } = useI18n()
const modal = useModal()

// Получаем последние задачи
const recentTasks = tasks.value.slice(0, 3)

// Открыть модалку добавления задачи
async function openAddTaskModal() {
  try {
    const result = await modal.open<Task>(TaskFormModal, {}, { title: t('task.addTask') })
    tasksStore.addTask(result)
  } catch (error) {
    // Modal was dismissed
    console.log('Modal dismissed:', error)
  }
}

// Открыть модалку редактирования задачи
async function openEditTaskModal(task: Task) {
  try {
    const result = await modal.open<Task>(
      TaskFormModal,
      { task },
      { title: t('task.editTask') },
    )
    tasksStore.updateTask(task.id, result)
  } catch (error) {
    // Modal was dismissed
    console.log('Modal dismissed:', error)
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1>{{ t('nav.dashboard') }}</h1>
      </div>
      <button class="btn-add" @click="openAddTaskModal">
        <AppIcon name="Plus" :size="20" />
        {{ t('task.addTask') }}
      </button>
    </div>

    <div class="dashboard-content">
      <AppCard :title="t('stats.total')" icon="📊">
        <TaskStats :stats="stats" />
      </AppCard>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

.dashboard-header {
  margin-bottom: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.dashboard-header h1 {
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

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-muted);
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


</style>
