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

const { t } = useI18n()
const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)
const modal = useModal()

const calendarEvents = computed(() => {
  return tasks.value
    .filter((task) => task.dueDate)
    .map((task) => ({
      id: task.id,
      title: `#${task.id} ${task.title}`,
      start: task.dueDate,
      allDay: false,
      backgroundColor: getPriorityColor(task.priority),
      borderColor: getPriorityColor(task.priority),
      extendedProps: {
        task,
      },
    }))
})

function getPriorityColor(priority: TaskPriority): string {
  const colors = {
    [TaskPriority.LOW]: '#0dcaf0',
    [TaskPriority.MEDIUM]: '#ffc107',
    [TaskPriority.HIGH]: '#dc3545',
    [TaskPriority.URGENT]: '#dc3545',
  }
  return colors[priority]
}

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
</script>

<template>
  <div class="calendar">
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
