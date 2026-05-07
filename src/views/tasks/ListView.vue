<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/composables/useModal'
import { TaskStatus, TaskPriority } from '@/types'
import type { Task } from '@/types'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const { t } = useI18n()
const modal = useModal()

const searchQuery = ref('')
const selectedStatus = ref<TaskStatus | 'all'>('all')
const selectedPriority = ref<TaskPriority | 'all'>('all')

const statusOptions = computed(() => [
  { label: t('status.all') || 'All Status', value: 'all' },
  { label: t('status.todo'), value: TaskStatus.TODO },
  { label: t('status.in_progress'), value: TaskStatus.IN_PROGRESS },
  { label: t('status.review'), value: TaskStatus.REVIEW },
  { label: t('status.done'), value: TaskStatus.DONE },
])

const priorityOptions = computed(() => [
  { label: t('priority.all') || 'All Priority', value: 'all' },
  { label: t('priority.low'), value: TaskPriority.LOW },
  { label: t('priority.medium'), value: TaskPriority.MEDIUM },
  { label: t('priority.high'), value: TaskPriority.HIGH },
  { label: t('priority.urgent'), value: TaskPriority.URGENT },
])

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

const priorityColors = {
  [TaskPriority.LOW]: 'var(--color-info)',
  [TaskPriority.MEDIUM]: 'var(--color-warning)',
  [TaskPriority.HIGH]: 'var(--color-danger)',
  [TaskPriority.URGENT]: 'var(--color-danger)',
}

function formatDate(date?: Date) {
  if (!date) return ''
  const d = new Date(date)
  const dateStr = d.toLocaleDateString()
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${dateStr} ${timeStr}`
}

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
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            :placeholder="t('common.search')"
            fluid
          />
        </IconField>
      </div>

      <div class="filter-group">
        <Select
          v-model="selectedStatus"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          fluid
        />
      </div>

      <div class="filter-group">
        <Select
          v-model="selectedPriority"
          :options="priorityOptions"
          optionLabel="label"
          optionValue="value"
          fluid
        />
      </div>

      <div class="filter-count">
        {{ filteredTasks.length }} {{ t('task.tasks') || 'tasks' }}
      </div>
    </div>

    <div class="tasks-table">
      <div v-if="filteredTasks.length > 0" class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th class="col-id">#</th>
              <th class="col-title">{{ t('task.title') }}</th>
              <th class="col-status">{{ t('task.status') }}</th>
              <th class="col-priority">{{ t('task.priority') }}</th>
              <th class="col-date">{{ t('task.dueDate') }}</th>
              <th class="col-tags">{{ t('task.tags') }}</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in filteredTasks"
              :key="task.id"
              class="table-row"
              @click="openEditTaskModal(task)"
            >
              <td class="col-id">
                <span class="task-id">#{{ task.id }}</span>
              </td>
              <td class="col-title">
                <div class="task-title-cell">
                  <div class="task-title">{{ task.title }}</div>
                  <div v-if="task.description" class="task-description">
                    {{ task.description }}
                  </div>
                </div>
              </td>
              <td class="col-status">
                <span class="status-badge">{{ t(`status.${task.status}`) }}</span>
              </td>
              <td class="col-priority">
                <span
                  class="priority-dot"
                  :style="{ backgroundColor: priorityColors[task.priority] }"
                  :title="t(`priority.${task.priority}`)"
                ></span>
              </td>
              <td class="col-date">
                <span v-if="task.dueDate" class="task-date">
                  {{ formatDate(task.dueDate) }}
                </span>
                <span v-else class="no-date">—</span>
              </td>
              <td class="col-tags">
                <div v-if="task.tags && task.tags.length" class="task-tags">
                  <span v-for="tag in task.tags.slice(0, 2)" :key="tag" class="task-tag">
                    {{ tag }}
                  </span>
                  <span v-if="task.tags.length > 2" class="more-tags">
                    +{{ task.tags.length - 2 }}
                  </span>
                </div>
              </td>
              <td class="col-actions">
                <button
                  class="delete-btn"
                  @click.stop="handleDeleteTask(task)"
                  :title="t('task.deleteTask')"
                >
                  <AppIcon name="Trash2" :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
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

.tasks-table {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: var(--color-background-soft);
  border-bottom: 2px solid var(--color-border);
}

.table th {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table tbody tr {
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.table tbody tr:hover {
  background-color: var(--color-background-soft);
}

.table tbody tr:hover .delete-btn {
  opacity: 1;
  visibility: visible;
}

.table td {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-sm);
  color: var(--color-text);
  vertical-align: middle;
}

.col-id {
  width: 60px;
}

.col-title {
  min-width: 250px;
}

.col-status {
  width: 120px;
}

.col-priority {
  width: 80px;
  text-align: center;
}

.col-date {
  width: 180px;
}

.col-tags {
  width: 200px;
}

.col-actions {
  width: 60px;
  text-align: right;
}

.task-id {
  font-size: var(--font-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
}

.task-title-cell {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.task-title {
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.task-description {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}

.status-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-background-soft);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  font-weight: var(--font-medium);
}

.priority-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.task-date {
  font-size: var(--font-xs);
  color: var(--color-text-secondary);
}

.no-date {
  color: var(--color-text-muted);
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

.more-tags {
  font-size: var(--font-xs);
  color: var(--color-text-muted);
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
  opacity: 0;
  visibility: hidden;
}

.delete-btn:hover {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.empty-state {
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

  .col-description,
  .col-tags {
    display: none;
  }

  .task-description {
    display: none;
  }
}
</style>
