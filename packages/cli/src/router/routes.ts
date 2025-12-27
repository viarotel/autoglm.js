import type { RouteConfig } from '@/types/router'
import { lazy } from 'react'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: lazy(() => import('@/pages/Welcome')),
    label: 'Welcome',
  },
  {
    path: '/tasks',
    component: lazy(() => import('@/pages/Tasks')),
    label: 'Tasks',
  },
]

export const routePaths = {
  HOME: '/' as const,
  TASKS: '/tasks' as const,
}
