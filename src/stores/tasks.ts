import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Task, TaskStatus, TaskStats } from '@/types'
import { TaskStatus as TaskStatusEnum, TaskPriority } from '@/types'

const STORAGE_KEY = 'task-flow-tasks'

// Загрузка задач из localStorage
function loadTasksFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Преобразуем строки дат обратно в Date объекты
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }))
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error)
  }
  return getDefaultTasks()
}

// Дефолтные задачи
function getDefaultTasks(): Task[] {
  return [
    {
      id: '1',
      title: 'Design new landing page',
      description: 'Create a modern landing page for the new product',
      status: TaskStatusEnum.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2024-02-15'),
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20'),
      tags: ['design', 'frontend'],
    },
    {
      id: '2',
      title: 'Fix authentication bug',
      description: 'Users cannot login with Google OAuth',
      status: TaskStatusEnum.TODO,
      priority: TaskPriority.URGENT,
      dueDate: new Date('2024-02-05'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      tags: ['bug', 'backend'],
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all REST API endpoints',
      status: TaskStatusEnum.REVIEW,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2024-02-20'),
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18'),
      tags: ['documentation'],
    },
    {
      id: '4',
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated deployment',
      status: TaskStatusEnum.DONE,
      priority: TaskPriority.HIGH,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-12'),
      tags: ['devops'],
    },
    {
      id: '5',
      title: 'Implement dark mode',
      description: 'Add dark theme support across the application',
      status: TaskStatusEnum.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2024-02-25'),
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-22'),
      tags: ['frontend', 'ui'],
    },
    {
      id: '6',
      title: 'Optimize database queries',
      description: 'Improve performance of slow queries',
      status: TaskStatusEnum.TODO,
      priority: TaskPriority.LOW,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      tags: ['backend', 'performance'],
    },
  ]
}

// Функция для получения следующего ID
function getNextId(tasks: Task[]): string {
  if (tasks.length === 0) return '1'
  
  // Находим максимальный числовой ID
  const maxId = tasks.reduce((max, task) => {
    const numId = parseInt(task.id)
    return !isNaN(numId) && numId > max ? numId : max
  }, 0)
  
  return String(maxId + 1)
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(loadTasksFromStorage())

  // Сохранение в localStorage при изменении
  watch(
    tasks,
    (newTasks) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks))
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error)
      }
    },
    { deep: true },
  )

  const stats = computed<TaskStats>(() => ({
    total: tasks.value.length,
    todo: tasks.value.filter((t) => t.status === TaskStatusEnum.TODO).length,
    inProgress: tasks.value.filter((t) => t.status === TaskStatusEnum.IN_PROGRESS).length,
    review: tasks.value.filter((t) => t.status === TaskStatusEnum.REVIEW).length,
    done: tasks.value.filter((t) => t.status === TaskStatusEnum.DONE).length,
  }))

  function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTask: Task = {
      ...task,
      id: getNextId(tasks.value),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    tasks.value.push(newTask)
  }

  function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  function deleteTask(id: string) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }

  function clearAllTasks() {
    tasks.value = []
  }

  function resetToDefaults() {
    tasks.value = getDefaultTasks()
  }

  function updateTaskStatus(id: string, status: TaskStatus) {
    updateTask(id, { status })
  }

  function getTasksByStatus(status: TaskStatus) {
    return tasks.value.filter((t) => t.status === status)
  }

  return {
    tasks,
    stats,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByStatus,
    clearAllTasks,
    resetToDefaults,
  }
})
