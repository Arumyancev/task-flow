<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useModal } from '@/composables/useModal'
import { useTasksStore } from '@/stores/tasks'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import type { Task } from '@/types'

const { t } = useI18n()
const route = useRoute()
const modal = useModal()
const tasksStore = useTasksStore()

const tabs = [
  { name: 'tasks-kanban', label: t('nav.kanban'), icon: 'Columns3' },
  { name: 'tasks-calendar', label: t('nav.calendar'), icon: 'Calendar' },
  { name: 'tasks-list', label: t('nav.tasks'), icon: 'List' },
]

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
  <div class="tasks-layout">
    <div class="tasks-header">
      <div class="tabs">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.name }"
          class="tab"
          :class="{ active: route.name === tab.name }"
        >
          <AppIcon :name="tab.icon" :size="20" />
          <span>{{ tab.label }}</span>
        </RouterLink>
      </div>

      <button class="btn-add" @click="openAddTaskModal">
        <AppIcon name="Plus" :size="20" />
        {{ t('task.addTask') }}
      </button>
    </div>

    <div class="tasks-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.tasks-layout {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.tabs {
  display: flex;
  gap: var(--spacing-xs);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
}

.tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-md);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.tab:hover {
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.tab.active {
  background-color: var(--color-primary);
  color: white;
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

.tasks-content {
  flex: 1;
}

@media (max-width: 768px) {
  .tasks-header {
    flex-direction: column;
    align-items: stretch;
  }

  .tabs {
    justify-content: center;
  }

  .tab span {
    display: none;
  }
}
</style>
