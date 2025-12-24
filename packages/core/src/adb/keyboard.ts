import type { ADBKeyboardCheckResult } from './types'
import path from 'node:path'
import { __dirname } from '@autoglm.js/shared'
import { getErrorMessage } from '@/utils/errorMessage'
import { runAdbCommand } from './utils'

export class ADBKeyboard {
  /**
   * Check ADB Keyboard is installed.
   */
  async isKeyboardInstalled(): Promise<ADBKeyboardCheckResult> {
    try {
      // 首先检查已启用的输入法
      const enabledResult = await runAdbCommand('shell', 'ime', 'list', '-s')
      const enabledImeList = enabledResult.stdout.trim()

      if (enabledImeList.includes('com.android.adbkeyboard/.AdbIME')) {
        return { success: true, message: 'ADB Keyboard is installed and enabled' }
      }
      else {
        return { success: false, message: 'ADB Keyboard is not installed' }
      }
    }
    catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      }
    }
  }

  /**
   * Install ADB Keyboard.
   */
  async installKeyboard() {
    try {
      const apkPath = path.join(__dirname, '../asset/ADBKeyboard.apk')
      await runAdbCommand('install', apkPath)
      await runAdbCommand('shell', 'ime', 'enable', 'com.android.adbkeyboard/.AdbIME')
    }
    catch (error) {
      return {
        success: false,
        message: getErrorMessage(error),
      }
    }
  }
}
