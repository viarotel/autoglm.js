export const APP_NAME = 'AutoGLM.js'

export const EVENT_TYPE_LABELS: Record<string, { label: string, color: string }> = {
  start: { label: 'START', color: 'cyan' },
  thinking: { label: 'THINKING', color: 'yellow' },
  action: { label: 'ACTION', color: 'blue' },
  task_complete: { label: 'COMPLETE', color: 'green' },
  error: { label: 'ERROR', color: 'red' },
  aborted: { label: 'ABORTED', color: 'magenta' },
}

export const DEFAULT_CONFIG = {
  maxSteps: 100,
  lang: 'cn' as const,
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  model: 'autoglm-phone',
  apiKey: '74fab98ebabd483a9fb88e311c14f61c.OIQrXM8thm8vSxo1',
}
