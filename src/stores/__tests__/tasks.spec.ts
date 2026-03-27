import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '../tasks'
import { TaskStatus, TaskPriority } from '@/types'

describe('Tasks Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default tasks', () => {
    const store = useTasksStore()
    expect(store.tasks.length).toBeGreaterThan(0)
  })

  it('calculates stats correctly', () => {
    const store = useTasksStore()
    const stats = store.stats

    expect(stats.total).toBe(store.tasks.length)
    expect(stats.todo + stats.inProgress + stats.review + stats.done).toBe(stats.total)
  })

  it('adds a new task', () => {
    const store = useTasksStore()
    const initialCount = store.tasks.length

    store.addTask({
      title: 'New Task',
      description: 'Test description',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    })

    expect(store.tasks.length).toBe(initialCount + 1)
    const newTask = store.tasks[store.tasks.length - 1]
    expect(newTask.title).toBe('New Task')
    expect(newTask.id).toBeDefined()
    expect(newTask.createdAt).toBeInstanceOf(Date)
  })

  it('updates a task', () => {
    const store = useTasksStore()
    const task = store.tasks[0]
    const newTitle = 'Updated Title'

    store.updateTask(task.id, { title: newTitle })

    const updatedTask = store.tasks.find((t) => t.id === task.id)
    expect(updatedTask?.title).toBe(newTitle)
    expect(updatedTask?.updatedAt).toBeInstanceOf(Date)
  })

  it('deletes a task', () => {
    const store = useTasksStore()
    const taskToDelete = store.tasks[0]
    const initialCount = store.tasks.length

    store.deleteTask(taskToDelete.id)

    expect(store.tasks.length).toBe(initialCount - 1)
    expect(store.tasks.find((t) => t.id === taskToDelete.id)).toBeUndefined()
  })

  it('updates task status', () => {
    const store = useTasksStore()
    const task = store.tasks[0]

    store.updateTaskStatus(task.id, TaskStatus.DONE)

    const updatedTask = store.tasks.find((t) => t.id === task.id)
    expect(updatedTask?.status).toBe(TaskStatus.DONE)
  })

  it('gets tasks by status', () => {
    const store = useTasksStore()

    const todoTasks = store.getTasksByStatus(TaskStatus.TODO)
    expect(todoTasks.every((t) => t.status === TaskStatus.TODO)).toBe(true)

    const doneTasks = store.getTasksByStatus(TaskStatus.DONE)
    expect(doneTasks.every((t) => t.status === TaskStatus.DONE)).toBe(true)
  })
})
