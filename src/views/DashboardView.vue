<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import AppCard from '@/components/common/AppCard.vue'
import TaskStats from '@/components/dashboard/TaskStats.vue'
import DateTimeWidget from '@/components/dashboard/DateTimeWidget.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/composables/useModal'
import type { Task } from '@/types'

const tasksStore = useTasksStore()
const { stats } = storeToRefs(tasksStore)
const { t } = useI18n()
const modal = useModal()

// Открыть модалку добавления задачи
async function openAddTaskModal() {
  try {
    const result = await modal.open<Task>(TaskFormModal, {}, { title: t('task.addTask') })
    tasksStore.addTask(result)
  } catch (error) {
    // Modal was dismissed
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1>{{ t('nav.dashboard') }}</h1>
        <p class="subtitle">{{ t('common.appName') }}</p>
      </div>
      <button class="btn-add" @click="openAddTaskModal">
        <AppIcon name="Plus" :size="20" />
        {{ t('task.addTask') }}
      </button>
    </div>

    <div class="dashboard-content">
      <div class="widgets-grid">
        <AppCard class="datetime-card">
          <DateTimeWidget />
        </AppCard>

        <AppCard :title="t('stats.total')" icon="📋">
          <TaskStats :stats="stats" />
        </AppCard>
      </div>
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

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.datetime-card {
  grid-column: span 1;
}

.datetime-card :deep(.card-content) {
  padding: 0 !important;
}

.datetime-card :deep(.card-header) {
  display: none;
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

@media (max-width: 768px) {
  .widgets-grid {
    grid-template-columns: 1fr;
  }
}
</style>
