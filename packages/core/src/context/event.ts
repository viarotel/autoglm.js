import type { EventData } from './types'
import mitt from 'mitt'

export enum EventType {
  START = 'start',
  THINKING = 'thinking',
  ACTION = 'action',
  TASK_COMPLETE = 'task_complete',
  ERROR = 'error',
  AGENT_ABORTED = 'agent_aborted',
}

export type MittEvents = Record<EventType, EventData>

export function createEmitter() {
  return mitt<MittEvents>()
}
