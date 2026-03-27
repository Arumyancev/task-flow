import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStatus, TaskStats } from '@/types'
import { TaskStatus as TaskStatusEnum, TaskPriority } from '@/types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([
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
  ])

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
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    tasks.value.push(newTask)
  }

  function updateTask(id: string, updates: Partial<Task>) {
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
  }
})
