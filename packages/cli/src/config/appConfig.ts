import { loadConfig } from './index'

export interface AppConfig {
  maxSteps: number
  lang: 'cn' | 'en'
  baseUrl: string
  apiKey: string
  model: string
  deviceId?: string
}

const DEFAULT_CONFIG: AppConfig = {
  maxSteps: 100,
  lang: 'cn',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: '74fab98ebabd483a9fb88e311c14f61c.OIQrXM8thm8vSxo1',
  model: 'autoglm-phone',
}

export function getAppConfig(): AppConfig {
  try {
    return loadConfig()
  }
  catch {
    return DEFAULT_CONFIG
  }
}
