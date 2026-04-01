<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import TaskCard from '@/components/common/TaskCard.vue'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/composables/useModal'
import { TaskStatus, TaskPriority } from '@/types'
import type { Task } from '@/types'

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const { t } = useI18n()
const modal = useModal()

const searchQuery = ref('')
const selectedStatus = ref<TaskStatus | 'all'>('all')
const selectedPriority = ref<TaskPriority | 'all'>('all')

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const matchesSearch =
      searchQuery.value === '' ||
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = selectedStatus.value === 'all' || task.status === selectedStatus.value
    const matchesPriority =
      selectedPriority.value === 'all' || task.priority === selectedPriority.value

    return matchesSearch && matchesStatus && matchesPriority
  })
})

async function openEditTaskModal(task: Task) {
  try {
    const result = await modal.open<Task>(
      TaskFormModal,
      { task },
      { title: t('task.editTask') },
    )
    tasksStore.updateTask(task.id, result)
  } catch (error) {
    // Modal dismissed
  }
}

async function handleDeleteTask(task: Task) {
  try {
    const confirmed = await modal.open<boolean>(
      ConfirmDialog,
      {
        message: t('task.deleteConfirm'),
        title: t('task.deleteTask'),
        confirmText: t('common.delete'),
        danger: true,
      },
      { size: 'sm' },
    )
    if (confirmed) {
      tasksStore.deleteTask(task.id)
    }
  } catch (error) {
    // Modal dismissed
  }
}
</script>

<template>
  <div class="tasks">
    <div class="filters">
      <div class="filter-group">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="t('common.search')"
        />
      </div>

      <div class="filter-group">
        <select v-model="selectedStatus" class="filter-select">
          <option value="all">{{ t('status.all') || 'All Status' }}</option>
          <option :value="TaskStatus.TODO">{{ t('status.todo') }}</option>
          <option :value="TaskStatus.IN_PROGRESS">{{ t('status.in_progress') }}</option>
          <option :value="TaskStatus.REVIEW">{{ t('status.review') }}</option>
          <option :value="TaskStatus.DONE">{{ t('status.done') }}</option>
        </select>
      </div>

      <div class="filter-group">
        <select v-model="selectedPriority" class="filter-select">
          <option value="all">{{ t('priority.all') || 'All Priority' }}</option>
          <option :value="TaskPriority.LOW">{{ t('priority.low') }}</option>
          <option :value="TaskPriority.MEDIUM">{{ t('priority.medium') }}</option>
          <option :value="TaskPriority.HIGH">{{ t('priority.high') }}</option>
          <option :value="TaskPriority.URGENT">{{ t('priority.urgent') }}</option>
        </select>
      </div>

      <div class="filter-count">
        {{ filteredTasks.length }} {{ t('task.tasks') || 'tasks' }}
      </div>
    </div>

    <div class="tasks-list">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @click="openEditTaskModal(task)"
        @delete="handleDeleteTask(task)"
      />
      <div v-if="filteredTasks.length === 0" class="empty-state">
        <div class="empty-icon">
          <AppIcon name="Search" :size="64" stroke-width="1.5" />
        </div>
        <p>{{ t('common.noData') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tasks {
  width: 100%;
}

.filters {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-count {
  color: var(--color-text-secondary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  white-space: nowrap;
}

.search-input,
.filter-select {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-md);
  transition: all var(--transition-fast);
}

.filter-select {
  padding-right: var(--spacing-xl);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-sm) center;
  appearance: none;
  cursor: pointer;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.tasks-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl);
  gap: var(--spacing-md);
  color: var(--color-text-muted);
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-muted);
}

.empty-state p {
  margin: 0;
  font-size: var(--font-lg);
}

@media (max-width: 768px) {
  .filter-group {
    min-width: 100%;
  }

  .tasks-list {
    grid-template-columns: 1fr;
  }
}
</style>
