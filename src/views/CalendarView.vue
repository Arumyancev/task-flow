<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTasksStore } from '@/stores/tasks'
import { useModal } from '@/composables/useModal'
import { storeToRefs } from 'pinia'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg, DateClickArg } from '@fullcalendar/core'
import type { Task } from '@/types'
import { TaskPriority } from '@/types'
import TaskFormModal from '@/components/tasks/TaskFormModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const { t } = useI18n()
const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const modal = useModal()

// Преобразуем задачи в события календаря
const calendarEvents = computed(() => {
  return tasks.value
    .filter((task) => task.dueDate) // Только задачи с датой
    .map((task) => ({
      id: task.id,
      title: `#${task.id} ${task.title}`,
      start: task.dueDate,
      allDay: false, // Показываем время
      backgroundColor: getPriorityColor(task.priority),
      borderColor: getPriorityColor(task.priority),
      extendedProps: {
        task,
      },
    }))
})

// Цвета для приоритетов
function getPriorityColor(priority: TaskPriority): string {
  const colors = {
    [TaskPriority.LOW]: '#0dcaf0', // info
    [TaskPriority.MEDIUM]: '#ffc107', // warning
    [TaskPriority.HIGH]: '#dc3545', // danger
    [TaskPriority.URGENT]: '#dc3545', // danger
  }
  return colors[priority]
}

// Конфигурация календаря
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: calendarEvents.value,
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  eventClick: handleEventClick,
  dateClick: handleDateClick,
  height: 'auto',
  locale: 'en',
  buttonText: {
    today: t('common.today') || 'Today',
    month: t('common.month') || 'Month',
    week: t('common.week') || 'Week',
    day: t('common.day') || 'Day',
  },
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  scrollTime: '09:00:00',
  nowIndicator: true,
}))

// Клик по событию (задаче)
async function handleEventClick(info: EventClickArg) {
  const task = info.event.extendedProps.task as Task
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

// Клик по дате (создание новой задачи)
async function handleDateClick(info: DateClickArg) {
  try {
    const result = await modal.open<Task>(
      TaskFormModal,
      {
        task: {
          dueDate: info.date,
        } as Partial<Task>,
      },
      { title: t('task.addTask') },
    )
    tasksStore.addTask(result)
  } catch (error) {
    // Modal dismissed
  }
}

async function openAddTaskModal() {
  try {
    const result = await modal.open<Task>(TaskFormModal, {}, { title: t('task.addTask') })
    tasksStore.addTask(result)
  } catch (error) {
    // Modal dismissed
  }
}
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <div>
        <h1>{{ t('nav.calendar') }}</h1>
        <p class="subtitle">{{ t('common.taskCalendar') || 'Task Timeline' }}</p>
      </div>
      <button class="btn-add" @click="openAddTaskModal">
        <AppIcon name="Plus" :size="20" />
        {{ t('task.addTask') }}
      </button>
    </div>

    <div class="calendar-wrapper">
      <FullCalendar :options="calendarOptions" />
    </div>

    <div class="calendar-legend">
      <div class="legend-item">
        <span class="legend-dot" style="background-color: #0dcaf0"></span>
        <span>{{ t('priority.low') }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background-color: #ffc107"></span>
        <span>{{ t('priority.medium') }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot" style="background-color: #dc3545"></span>
        <span>{{ t('priority.high') }} / {{ t('priority.urgent') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  width: 100%;
}

.calendar-header {
  margin-bottom: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
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

.calendar-wrapper {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.calendar-legend {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* FullCalendar стили для темы */
.calendar-wrapper :deep(.fc) {
  color: var(--color-text);
}

.calendar-wrapper :deep(.fc .fc-button) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.calendar-wrapper :deep(.fc .fc-button:hover) {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.calendar-wrapper :deep(.fc .fc-button:disabled) {
  opacity: 0.5;
}

.calendar-wrapper :deep(.fc .fc-button-active) {
  background-color: var(--color-primary-hover) !important;
  border-color: var(--color-primary-hover) !important;
}

.calendar-wrapper :deep(.fc-theme-standard td),
.calendar-wrapper :deep(.fc-theme-standard th) {
  border-color: var(--color-border);
}

.calendar-wrapper :deep(.fc-theme-standard .fc-scrollgrid) {
  border-color: var(--color-border);
}

.calendar-wrapper :deep(.fc-col-header-cell) {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-weight: var(--font-semibold);
}

.calendar-wrapper :deep(.fc-daygrid-day) {
  background-color: var(--color-surface);
}

.calendar-wrapper :deep(.fc-daygrid-day:hover) {
  background-color: var(--color-background-soft);
  cursor: pointer;
}

.calendar-wrapper :deep(.fc-day-today) {
  background-color: var(--color-primary-light) !important;
}

.calendar-wrapper :deep(.fc-event) {
  cursor: pointer;
  border-radius: var(--radius-sm);
  padding: 2px 4px;
  font-size: var(--font-xs);
}

.calendar-wrapper :deep(.fc-event:hover) {
  opacity: 0.8;
}

.calendar-wrapper :deep(.fc-toolbar-title) {
  color: var(--color-text);
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
}

.calendar-wrapper :deep(.fc-daygrid-day-number) {
  color: var(--color-text);
  padding: var(--spacing-xs);
}

.calendar-wrapper :deep(.fc-daygrid-day-top) {
  justify-content: center;
}
</style>
