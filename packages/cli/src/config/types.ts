import type { AgentConfigType, DeviceInfo, EventType } from 'autoglm.js'
import type { RoutePath } from '@/router/routes'

export type AgentConfig = AgentConfigType

export interface AgentEvent {
  type: string
  data: unknown
  time: string
  deviceId?: string
}

export type EventCallback = (data: unknown) => void

export interface AgentState {
  isRunning: boolean
  currentTask: string | null
  events: AgentEvent[]
  version: string
  devices: DeviceInfo[]
  systemCheck: boolean | null
  apiCheck: boolean | null
  currentDeviceId: string | undefined
}

export interface AgentActions {
  run: (query: string) => Promise<void>
  abort: (reason?: string) => void
  stop: () => void
  clearEvents: () => void
  refreshDevices: () => Promise<void>
  checkSystem: () => Promise<void>
  checkApi: () => Promise<void>
  getConfig: () => AgentConfig
  updateConfig: (config: Partial<AgentConfig>) => void
  navigate: (path: RoutePath, options?: { replace?: boolean }) => void
}

export type AgentContextValue = AgentState & AgentActions

export type Locale = 'cn' | 'en'

export interface LocaleMessages {
  [key: string]: string | LocaleMessages
}

export interface CommandInfo {
  name: string
  description: string
  execute: () => void
}

export type EventHandlerMap = {
  [K in EventType]: EventCallback
}
