import { DEFAULT_CONFIG } from '@/utils/constants'
import { loadConfig } from './index'

export interface AppConfig {
  maxSteps: number
  lang: 'cn' | 'en'
  baseUrl: string
  apiKey: string
  model: string
  deviceId?: string
}

export function getAppConfig(): AppConfig {
  try {
    return loadConfig()
  }
  catch {
    return DEFAULT_CONFIG
  }
}
