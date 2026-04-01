<script setup lang="ts">
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import AppCard from '@/components/common/AppCard.vue'
import TaskStats from '@/components/dashboard/TaskStats.vue'
import DateTimeWidget from '@/components/dashboard/DateTimeWidget.vue'
import WeatherWidget from '@/components/dashboard/WeatherWidget.vue'
import { useI18n } from 'vue-i18n'

const tasksStore = useTasksStore()
const { stats } = storeToRefs(tasksStore)
const { t } = useI18n()
</script>

<template>
  <div class="dashboard">

    <div class="dashboard-content">
      <div class="widgets-grid">
        <AppCard class="datetime-card">
          <DateTimeWidget />
        </AppCard>

        <AppCard :title="t('common.weather') || 'Weather'" class="weather-card">
          <WeatherWidget />
        </AppCard>

        <AppCard :title="t('stats.total')" icon="📋" class="stats-card">
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



.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

.datetime-card {
  grid-column: span 1;
}

.weather-card {
  grid-column: span 1;
}

.stats-card {
  grid-column: span 1;
}

.datetime-card :deep(.card-content) {
  padding: 0 !important;
}

.datetime-card :deep(.card-header) {
  display: none;
}

.weather-card :deep(.card-content) {
  padding: 0 !important;
}

@media (max-width: 1200px) {
  .widgets-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-card {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .widgets-grid {
    grid-template-columns: 1fr;
  }

  .datetime-card,
  .weather-card,
  .stats-card {
    grid-column: span 1;
  }
}
</style>
