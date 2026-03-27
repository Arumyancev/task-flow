<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import AppCard from '@/components/common/AppCard.vue'
import TaskStats from '@/components/dashboard/TaskStats.vue'
import TaskCard from '@/components/common/TaskCard.vue'
import { useI18n } from 'vue-i18n'
import { TaskStatus } from '@/types'

const tasksStore = useTasksStore()
const { stats, tasks } = storeToRefs(tasksStore)
const { t } = useI18n()

// Получаем последние задачи
const recentTasks = tasks.value.slice(0, 3)
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>{{ t('nav.dashboard') }}</h1>
      <p class="subtitle">{{ t('common.appName') }}</p>
    </div>

    <div class="dashboard-content">
      <AppCard :title="t('stats.total')" icon="📊">
        <TaskStats :stats="stats" />
      </AppCard>

      <AppCard :title="t('task.title')" icon="📋" class="recent-tasks">
        <div v-if="recentTasks.length === 0" class="empty-state">
          {{ t('common.noData') }}
        </div>
        <div v-else class="tasks-list">
          <TaskCard v-for="task in recentTasks" :key="task.id" :task="task" />
        </div>
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
</style>
