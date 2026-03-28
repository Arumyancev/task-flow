<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  icon: '',
  loading: false,
})
</script>

<template>
  <div class="card">
    <div v-if="title || icon" class="card-header">
      <h3 v-if="title" class="card-title">{{ title }}</h3>
    </div>
    <div class="card-content">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.card-icon {
  font-size: var(--font-2xl);
}

.card-title {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.card-content {
  padding: var(--spacing-lg);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
