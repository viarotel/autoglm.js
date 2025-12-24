import dayjs from 'dayjs'
import mitt from 'mitt'

export interface EventData {
  message: any
  time: string
}

export enum EventType {
  START = 'start',
  THINKING = 'thinking',
  ACTION = 'action',
  TASK_COMPLETE = 'task_complete',
  ERROR = 'error',
}

export const emitter = mitt()

export function emit(event: EventType, data: any) {
  emitter.emit(event, {
    message: data,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
  })
}
