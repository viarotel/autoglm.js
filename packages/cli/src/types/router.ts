import type { ComponentType, LazyExoticComponent } from 'react'

export type RoutePath = '/' | '/tasks'

export interface RouteConfig {
  path: RoutePath
  component: LazyExoticComponent<ComponentType>
  label?: string
}

export type NavigateFunction = (path: RoutePath, options?: { replace?: boolean }) => void

export interface NavigationHandlers {
  handleNavigate: (path: RoutePath) => void
  handleCommandSubmit: (command: string) => void
  handleTaskSubmit: (task: string) => void
}
