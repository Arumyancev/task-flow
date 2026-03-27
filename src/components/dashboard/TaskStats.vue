<script setup lang="ts">
import type { TaskStats } from '@/types'
import { useI18n } from 'vue-i18n'

interface Props {
  stats: TaskStats
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <div class="stats-grid">
    <div class="stat-card total">
      <div class="stat-icon">📊</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">{{ t('stats.total') }}</div>
      </div>
    </div>

    <div class="stat-card done">
      <div class="stat-icon">✅</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.done }}</div>
        <div class="stat-label">{{ t('stats.completed') }}</div>
      </div>
    </div>

    <div class="stat-card in-progress">
      <div class="stat-icon">🚀</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.inProgress }}</div>
        <div class="stat-label">{{ t('stats.inProgress') }}</div>
      </div>
    </div>

    <div class="stat-card todo">
      <div class="stat-icon">📝</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.todo }}</div>
        <div class="stat-label">{{ t('stats.pending') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-background-soft) 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: width var(--transition-fast);
}

.stat-card:hover::before {
  width: 100%;
  opacity: 0.1;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card.total::before {
  background-color: var(--color-primary);
}

.stat-card.done::before {
  background-color: var(--color-success);
}

.stat-card.in-progress::before {
  background-color: var(--color-info);
}

.stat-card.todo::before {
  background-color: var(--color-warning);
}

.stat-icon {
  font-size: var(--font-4xl);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--font-3xl);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}
</style>
