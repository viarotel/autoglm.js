import type { ComponentType, LazyExoticComponent } from 'react'

import { lazy } from 'react'

export type RoutePath = '/' | '/tasks' | '/config' | '/devices'

export interface RouteConfig {
  path: RoutePath
  component: LazyExoticComponent<ComponentType>
  label?: string
}

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
  {
    path: '/config',
    component: lazy(() => import('@/pages/Config')),
    label: 'Config',
  },
  {
    path: '/devices',
    component: lazy(() => import('@/pages/Devices')),
    label: 'Devices',
  },
]

export const routePaths = {
  HOME: '/',
  TASKS: '/tasks',
  CONFIG: '/config',
  DEVICES: '/devices',
} as const
