import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes } from '../index'

// Создаём свежий экземпляр роутера для каждого теста
function createTestRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes,
  })
}

describe('Router configuration', () => {
  let router: Router

  beforeEach(() => {
    router = createTestRouter()
  })

  it('should have correct number of top-level routes', () => {
    expect(router.getRoutes().length).toBeGreaterThanOrEqual(2)
  })

  describe('Route: / (Dashboard)', () => {
    it('should have correct route for /', async () => {
      const route = router.resolve('/')
      expect(route.name).toBe('dashboard')
      expect(route.matched.length).toBeGreaterThan(0)
    })

    it('should have a route named "dashboard"', () => {
      const route = router.getRoutes().find((r) => r.name === 'dashboard')
      expect(route).toBeDefined()
      expect(route?.path).toBe('/')
    })

    it('should load DashboardView component', async () => {
      const route = router.getRoutes().find((r) => r.name === 'dashboard')
      const component = await route?.components?.default
      expect(component).toBeDefined()
    })
  })

  describe('Route: /tasks', () => {
    it('should have a route for /tasks', () => {
      const route = router.getRoutes().find((r) => r.name === 'tasks')
      expect(route).toBeDefined()
      expect(route?.path).toBe('/tasks')
    })

    it('should have a redirect property to /tasks/kanban', () => {
      const route = router.getRoutes().find((r) => r.name === 'tasks')
      expect(route?.redirect).toBe('/tasks/kanban')
    })

    it('should have child routes', () => {
      const route = router.getRoutes().find((r) => r.name === 'tasks')
      expect(route?.children).toBeDefined()
      expect(route?.children?.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Route: /tasks/kanban (KanbanView)', () => {
    it('should resolve with name "tasks-kanban"', () => {
      const route = router.resolve('/tasks/kanban')
      expect(route.name).toBe('tasks-kanban')
    })

    it('should lazy-load KanbanView component', async () => {
      const route = router.getRoutes().find((r) => r.name === 'tasks-kanban')
      const component = await route?.components?.default
      expect(component).toBeDefined()
    })
  })

  describe('Route: /tasks/calendar (CalendarView)', () => {
    it('should resolve with name "tasks-calendar"', () => {
      const route = router.resolve('/tasks/calendar')
      expect(route.name).toBe('tasks-calendar')
    })

    it('should lazy-load CalendarView component', async () => {
      const route = router.getRoutes().find((r) => r.name === 'tasks-calendar')
      const component = await route?.components?.default
      expect(component).toBeDefined()
    })
  })

  describe('Route: /tasks/list (ListView)', () => {
    it('should resolve with name "tasks-list"', () => {
      const route = router.resolve('/tasks/list')
      expect(route.name).toBe('tasks-list')
    })

    it('should lazy-load ListView component', async () => {
      const route = router.getRoutes().find((r) => r.name === 'tasks-list')
      const component = await route?.components?.default
      expect(component).toBeDefined()
    })
  })

  describe('Navigation', () => {
    it('should navigate to /tasks/kanban from /', async () => {
      await router.push('/')
      expect(router.currentRoute.value.name).toBe('dashboard')

      await router.push('/tasks/kanban')
      expect(router.currentRoute.value.name).toBe('tasks-kanban')
    })

    it('should navigate between task views', async () => {
      await router.push('/tasks/kanban')
      expect(router.currentRoute.value.name).toBe('tasks-kanban')

      await router.push('/tasks/calendar')
      expect(router.currentRoute.value.name).toBe('tasks-calendar')

      await router.push('/tasks/list')
      expect(router.currentRoute.value.name).toBe('tasks-list')
    })

    it('should go back to dashboard from tasks', async () => {
      await router.push('/tasks/list')
      expect(router.currentRoute.value.name).toBe('tasks-list')

      await router.push('/')
      expect(router.currentRoute.value.name).toBe('dashboard')
    })

    it('should redirect /tasks to /tasks/kanban on navigation', async () => {
      await router.push('/tasks')
      expect(router.currentRoute.value.name).toBe('tasks-kanban')
    })
  })

  describe('Route params and navigation guards', () => {
    it('should pass params correctly', async () => {
      await router.push('/tasks/kanban')
      expect(router.currentRoute.value.path).toBe('/tasks/kanban')
      expect(router.currentRoute.value.fullPath).toBe('/tasks/kanban')
    })

    it('should handle case-insensitive routes (default behavior)', async () => {
      // Vue Router по умолчанию не чувствителен к регистру
      await router.push('/Tasks/Kanban')
      expect(router.currentRoute.value.name).toBe('tasks-kanban')
      expect(router.currentRoute.value.path).toBe('/Tasks/Kanban')
    })

    it('should get correct route params for task views', async () => {
      await router.push('/tasks/list')
      expect(router.currentRoute.value.params).toEqual({})

      await router.push('/tasks/calendar')
      expect(router.currentRoute.value.params).toEqual({})
    })
  })
})
