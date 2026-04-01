import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/tasks/TasksLayout.vue'),
      redirect: '/tasks/kanban',
      children: [
        {
          path: 'kanban',
          name: 'tasks-kanban',
          component: () => import('@/views/tasks/KanbanView.vue'),
        },
        {
          path: 'calendar',
          name: 'tasks-calendar',
          component: () => import('@/views/tasks/CalendarView.vue'),
        },
        {
          path: 'list',
          name: 'tasks-list',
          component: () => import('@/views/tasks/ListView.vue'),
        },
      ],
    },
  ],
})

export default router
