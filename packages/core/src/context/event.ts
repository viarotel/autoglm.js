import mitt from 'mitt'

export enum EventType {
  START = 'start',
  THINKING = 'thinking',
  ACTION = 'action',
  TASK_COMPLETE = 'task_complete',
  ERROR = 'error',
}

export type MittEvents = Record<EventType, any>

export function createEmitter() {
  return mitt<MittEvents>()
}
