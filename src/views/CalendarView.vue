<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/common/AppIcon.vue'

const { t } = useI18n()
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <h1>{{ t('nav.calendar') }}</h1>
      <p class="subtitle">Task Timeline</p>
    </div>

    <div class="calendar-placeholder">
      <div class="placeholder-icon">
        <AppIcon name="Calendar" :size="64" stroke-width="1.5" />
      </div>
      <h2>Calendar View</h2>
      <p>FullCalendar integration will be added here</p>
      <p class="hint">Install: npm install @fullcalendar/vue3 @fullcalendar/core</p>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  width: 100%;
}

.calendar-header {
  margin-bottom: var(--spacing-2xl);
}

.calendar-header h1 {
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

.calendar-placeholder {
  background-color: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.placeholder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.calendar-placeholder h2 {
  font-size: var(--font-2xl);
  color: var(--color-text);
  margin: 0;
}

.calendar-placeholder p {
  color: var(--color-text-secondary);
  margin: 0;
}

.hint {
  font-family: monospace;
  background-color: var(--color-background-soft);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
}
</style>
