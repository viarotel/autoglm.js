import { exec } from 'tinyexec'
import { getAgentConfig } from '@/config'

/**
 * Get ADB command prefix with optional device specifier.
 */
export function getAdbPrefix(deviceId?: string): string[] {
  return deviceId ? ['adb', '-s', deviceId] : ['adb']
}

export async function runAdbCommand(...args: string[]) {
  const config = getAgentConfig()
  const prefix = getAdbPrefix(config.deviceId)
  return await exec(prefix[0], [...prefix.slice(1), ...args])
}
